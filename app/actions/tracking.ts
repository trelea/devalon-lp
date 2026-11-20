"use server";

import crypto from "node:crypto";
import { headers } from "next/headers";
import { META_EVENT } from "@/lib/tracking/events";
import type { TrackingPayload } from "@/lib/tracking/events";
import { siteUrl } from "@/lib/site";

const MAX_EVENT_AGE_SECONDS = 60 * 60 * 24 * 7;
const FUTURE_TOLERANCE_SECONDS = 60 * 60;
const COUNTRY_PLACEHOLDERS = new Set(["xx", "t1", "a1", "a2", "o1"]);

/** Trim, drop control chars, cap length. Never throws. */
function text(value: string | null | undefined, max = 512): string | undefined {
  if (typeof value !== "string") return undefined;
  const clean = value.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  return clean ? clean.slice(0, max) : undefined;
}

function sha256(value: string): string {
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

function decode(value: string | null): string | undefined {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** ISO 3166-1 alpha-2 only; rejects XX/T1/etc. from geo providers. */
function countryCode(value: string | null): string | undefined {
  const code = text(value, 16)?.toLowerCase();
  return code && /^[a-z]{2}$/.test(code) && !COUNTRY_PLACEHOLDERS.has(code)
    ? code
    : undefined;
}

/** Vercel regions can be up to 3 alphanumeric chars (e.g. `ENG`, `13`). */
function regionCode(value: string | null): string | undefined {
  const code = text(value, 16)?.toLowerCase();
  return code && /^[a-z0-9]{1,3}$/.test(code) ? code : undefined;
}

/** Meta wants city lowercased, without diacritics, periods, commas or spaces. */
function normalizeCity(value: string | null | undefined): string | undefined {
  const raw = text(decode(value ?? null), 120);
  if (!raw) return undefined;
  const city = raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,'’]/g, "")
    .replace(/\s+/g, "");
  return city || undefined;
}

function normalizePhone(value: string): string | undefined {
  const digits = value.replace(/\D/g, "").replace(/^00/, "");
  return digits.length >= 7 ? digits : undefined;
}

function isIp(value: string): boolean {
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(value)) {
    return value.split(".").every((part) => Number(part) <= 255);
  }
  return /^[0-9a-f:]+$/i.test(value) && value.includes(":");
}

function isNonRoutable(value: string): boolean {
  return (
    value === "::1" ||
    value === "0.0.0.0" ||
    /^127\./.test(value) ||
    /^10\./.test(value) ||
    /^192\.168\./.test(value) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(value) ||
    /^169\.254\./.test(value) ||
    /^f[cd][0-9a-f]{2}:/i.test(value) ||
    /^fe80:/i.test(value)
  );
}

/** Pick the first plausible public IP from the trusted proxy headers. */
function clientIp(headerList: Headers): string | undefined {
  const candidates = [
    headerList.get("cf-connecting-ip"),
    headerList.get("x-forwarded-for")?.split(",")[0],
    headerList.get("x-vercel-forwarded-for")?.split(",")[0],
    headerList.get("x-real-ip"),
  ];

  for (const candidate of candidates) {
    const raw = text(candidate, 64);
    if (!raw) continue;

    let ip = raw;
    if (ip.startsWith("[")) {
      // Bracketed IPv6, optionally with a port: "[2001:db8::1]:443"
      const end = ip.indexOf("]");
      if (end === -1) continue;
      ip = ip.slice(1, end);
    } else if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(ip)) {
      // IPv4 with a port — strip it. Never strip the last IPv6 hextet.
      ip = ip.replace(/:\d+$/, "");
    }

    if (!isIp(ip) || isNonRoutable(ip)) continue;
    return ip;
  }
  return undefined;
}

function absoluteUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

/** Guard against skewed client clocks and bogus timestamps. */
function safeEventTime(value: number | undefined): number {
  const now = Math.floor(Date.now() / 1000);
  if (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= now - MAX_EVENT_AGE_SECONDS &&
    value <= now + FUTURE_TOLERANCE_SECONDS
  ) {
    return Math.floor(value);
  }
  return now;
}

function hashUserData(userData?: TrackingPayload["userData"]) {
  if (!userData) return {};
  const out: Record<string, string> = {};

  const email = text(userData.email, 320);
  if (email) out.em = sha256(email);

  const phone = text(userData.phone, 40);
  const normalizedPhone = phone ? normalizePhone(phone) : undefined;
  if (normalizedPhone) out.ph = sha256(normalizedPhone);

  const firstName = text(userData.firstName, 120);
  if (firstName) out.fn = sha256(firstName);

  const lastName = text(userData.lastName, 120);
  if (lastName) out.ln = sha256(lastName);

  const city = normalizeCity(userData.city);
  if (city) out.ct = sha256(city);

  const country = countryCode(userData.country ?? null);
  if (country) out.country = sha256(country);

  return out;
}

export async function sendCapiEvent(payload: TrackingPayload) {
  const pixelId =
    text(process.env.META_PIXEL_ID, 64) ??
    text(process.env.NEXT_PUBLIC_META_PIXEL_ID, 64);
  const accessToken = text(process.env.META_CAPI_ACCESS_TOKEN, 512);
  if (!pixelId || !accessToken) return;

  const headerList = await headers();

  // Raw fields — never hashed, or Meta cannot match them.
  const ip = clientIp(headerList);
  const userAgent =
    text(headerList.get("user-agent"), 4096) ?? text(payload.userAgent, 4096);
  const fbp = text(payload.fbp, 255);
  const fbc = text(payload.fbc, 255);

  // Geo — prefer Cloudflare, fall back to Vercel (DNS-only setups).
  const country =
    countryCode(headerList.get("cf-ipcountry")) ??
    countryCode(headerList.get("x-vercel-ip-country"));
  const city = normalizeCity(
    headerList.get("cf-ipcity") ?? headerList.get("x-vercel-ip-city")
  );
  const region =
    regionCode(headerList.get("cf-region-code")) ??
    regionCode(headerList.get("x-vercel-ip-country-region"));

  const externalId = text(payload.externalId, 255);
  const testEventCode = text(process.env.META_TEST_EVENT_CODE, 64);

  const userData: Record<string, string> = {
    ...hashUserData(payload.userData),
    ...(userAgent ? { client_user_agent: userAgent } : {}),
    ...(ip ? { client_ip_address: ip } : {}),
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
    ...(externalId ? { external_id: sha256(externalId) } : {}),
    ...(country ? { country: sha256(country) } : {}),
    ...(city ? { ct: sha256(city) } : {}),
    ...(region ? { st: sha256(region) } : {}),
  };

  const eventName = META_EVENT[payload.name] ?? "CustomEvent";

  const body = {
    data: [
      {
        event_name: eventName,
        event_time: safeEventTime(payload.eventTime),
        event_id: text(payload.eventId, 128) ?? crypto.randomUUID(),
        action_source: "website",
        event_source_url: absoluteUrl(payload.url) ?? siteUrl,
        user_data: userData,
        custom_data: payload.params ?? {},
      },
    ],
    access_token: accessToken,
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://graph.facebook.com/v25.0/${pixelId}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const detail = (await response.text().catch(() => ""))
        .replaceAll(accessToken, "[REDACTED]")
        .slice(0, 400);
      console.error(
        `[sendCapiEvent] Meta rejected ${eventName}: HTTP ${response.status} ${detail}`
      );
      return;
    }

    const result = (await response.json().catch(() => null)) as {
      events_received?: number;
      fbtrace_id?: string;
    } | null;
    if (result?.events_received === 0) {
      console.error(
        `[sendCapiEvent] Meta received 0 events (trace: ${result.fbtrace_id ?? "n/a"})`
      );
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[sendCapiEvent] request failed", error);
    }
  } finally {
    clearTimeout(timeout);
  }
}
