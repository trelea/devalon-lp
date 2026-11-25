/**
 * Server-only IP geolocation: ipwho.is first, ipapi.co as fallback.
 *
 * Both free tiers cap requests per egress IP (~1k/day), so every successful or
 * failed lookup is cached in memory and concurrent lookups for the same IP
 * share one promise. Failures never throw — tracking continues without geo.
 */

import { isPublicIp } from "./ip";

export interface GeoInfo {
  country?: string;
  state?: string;
  city?: string;
  postal?: string;
}

type ProviderName = "ipwho" | "ipapi";

type Provider = {
  name: ProviderName;
  lookup: (ip: string, signal: AbortSignal) => Promise<GeoInfo | null>;
};

type CacheEntry = {
  promise?: Promise<GeoInfo | null>;
  value?: GeoInfo | null;
  expiresAt: number;
};

class RateLimitError extends Error {
  readonly retryAfterMs: number;

  constructor(retryAfterMs: number) {
    super("rate_limited");
    this.retryAfterMs = retryAfterMs;
  }
}

const TTL_HIT = 24 * 60 * 60 * 1000;
const TTL_MISS = 5 * 60 * 1000;
const MAX_ENTRIES = 2000;
const PROVIDER_TIMEOUT_MS = 1200;
const TOTAL_BUDGET_MS = 2500;
const FAILURE_WINDOW_MS = 5 * 60 * 1000;
const MAX_FAILURES = 10;

const cache = new Map<string, CacheEntry>();
const cooldownUntil: Record<ProviderName, number> = { ipwho: 0, ipapi: 0 };
let failureWindowStart = 0;
let failures = 0;
let circuitOpenUntil = 0;

function field(value: unknown, max = 120): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function countryCode(value: unknown): string | undefined {
  const code = field(value, 8)?.toUpperCase();
  return code && /^[A-Z]{2}$/.test(code) ? code : undefined;
}

function postalCode(value: unknown): string | undefined {
  const code = field(value, 16)?.replace(/\s+/g, "");
  return code && /^[A-Za-z0-9-]{1,16}$/.test(code) ? code : undefined;
}

function compact(geo: GeoInfo): GeoInfo | null {
  return Object.keys(geo).length ? geo : null;
}

async function fetchJson(
  url: string,
  signal: AbortSignal
): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(url, {
      signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (response.status === 429) {
      const raw = Number(response.headers.get("retry-after"));
      const seconds = Number.isFinite(raw) && raw > 0 ? raw : 60;
      throw new RateLimitError(Math.min(Math.max(seconds, 60), 3600) * 1000);
    }
    if (!response.ok) return null;

    const json: unknown = await response.json();
    return json && typeof json === "object"
      ? (json as Record<string, unknown>)
      : null;
  } catch (error) {
    if (error instanceof RateLimitError) throw error;
    return null;
  }
}

const providers: readonly Provider[] = [
  {
    name: "ipwho",
    async lookup(ip, signal) {
      const data = await fetchJson(
        `https://ipwho.is/${encodeURIComponent(ip)}`,
        signal
      );
      if (!data || data.success === false) return null;
      return compact({
        country: countryCode(data.country_code),
        state: field(data.region_code, 16)?.toUpperCase(),
        city: field(data.city),
        postal: postalCode(data.postal),
      });
    },
  },
  {
    name: "ipapi",
    async lookup(ip, signal) {
      const data = await fetchJson(
        `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
        signal
      );
      if (!data || data.error === true) return null;
      return compact({
        country: countryCode(data.country_code ?? data.country),
        state: field(data.region_code, 16)?.toUpperCase(),
        city: field(data.city),
        postal: postalCode(data.postal),
      });
    },
  },
];

async function withTimeout<T>(
  work: (signal: AbortSignal) => Promise<T>,
  parent: AbortSignal,
  timeoutMs: number
): Promise<T> {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  if (parent.aborted) controller.abort();
  else parent.addEventListener("abort", onAbort, { once: true });
  const timer = setTimeout(onAbort, timeoutMs);
  try {
    return await work(controller.signal);
  } finally {
    clearTimeout(timer);
    parent.removeEventListener("abort", onAbort);
  }
}

function recordSuccess(): void {
  failures = 0;
  failureWindowStart = 0;
  circuitOpenUntil = 0;
}

function recordFailure(): void {
  const now = Date.now();
  if (!failureWindowStart || now - failureWindowStart > FAILURE_WINDOW_MS) {
    failureWindowStart = now;
    failures = 0;
  }
  failures += 1;
  if (failures >= MAX_FAILURES) {
    circuitOpenUntil = now + FAILURE_WINDOW_MS;
    failureWindowStart = 0;
    failures = 0;
  }
}

async function resolveGeo(ip: string): Promise<GeoInfo | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TOTAL_BUDGET_MS);
  const deadline = Date.now() + TOTAL_BUDGET_MS;

  try {
    for (const provider of providers) {
      if (controller.signal.aborted || Date.now() >= deadline) break;
      if (cooldownUntil[provider.name] > Date.now()) continue;

      try {
        const geo = await withTimeout(
          (signal) => provider.lookup(ip, signal),
          controller.signal,
          Math.min(PROVIDER_TIMEOUT_MS, Math.max(1, deadline - Date.now()))
        );
        if (geo) {
          recordSuccess();
          return geo;
        }
      } catch (error) {
        if (error instanceof RateLimitError) {
          cooldownUntil[provider.name] = Date.now() + error.retryAfterMs;
        }
      }
    }
    recordFailure();
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Resolve geo for a public IP. Returns null on any failure, never throws. */
export async function lookupGeo(ip: string | undefined): Promise<GeoInfo | null> {
  if (!ip || !isPublicIp(ip)) return null;

  const now = Date.now();
  if (circuitOpenUntil > now) return null;

  const cached = cache.get(ip);
  if (cached) {
    if (cached.promise) return cached.promise;
    if (cached.expiresAt > now) return cached.value ?? null;
    cache.delete(ip);
  }

  const promise = resolveGeo(ip);
  cache.set(ip, { promise, expiresAt: now + TOTAL_BUDGET_MS });
  if (cache.size > MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined && oldest !== ip) cache.delete(oldest);
  }

  void promise.then(
    (value) => {
      cache.set(ip, {
        value,
        expiresAt: Date.now() + (value ? TTL_HIT : TTL_MISS),
      });
    },
    () => {
      cache.set(ip, { value: null, expiresAt: Date.now() + TTL_MISS });
    }
  );

  return promise;
}
