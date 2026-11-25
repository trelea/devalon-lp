"use server";

import crypto from "node:crypto";
import { headers } from "next/headers";
import { META_EVENT } from "@/lib/tracking/events";
import type { TrackingPayload } from "@/lib/tracking/events";
import { buildCapiParams } from "@/lib/tracking/param-builder";
import { lookupGeo } from "@/lib/tracking/geo";
import { clientIpFromHeaders } from "@/lib/tracking/ip";
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

export async function sendCapiEvent(payload: TrackingPayload) {
  const pixelId =
    text(process.env.META_PIXEL_ID, 64) ??
    text(process.env.NEXT_PUBLIC_META_PIXEL_ID, 64);
  const accessToken = text(process.env.META_CAPI_ACCESS_TOKEN, 512);
  if (!pixelId || !accessToken) return;

  // Meta's server-side SDK resolves fbc/fbp/IP/URLs from the incoming request
  // and returns the first-party cookies it wants us to persist.
  const capi = await buildCapiParams(payload.url);

  const headerList = await headers();

  const userAgent =
    text(headerList.get("user-agent"), 4096) ?? text(payload.userAgent, 4096);

  // Geo — prefer Cloudflare, fall back to Vercel (DNS-only setups).
  const country =
    countryCode(headerList.get("cf-ipcountry")) ??
    countryCode(headerList.get("x-vercel-ip-country"));
  const city = text(
    decode(headerList.get("cf-ipcity") ?? headerList.get("x-vercel-ip-city")),
    120
  );
  const region =
    regionCode(headerList.get("cf-region-code")) ??
    regionCode(headerList.get("x-vercel-ip-country-region"));

  // Edge headers stay authoritative for country/region/city. The IP APIs only
  // fill gaps and are the sole source for the postal code.
  const geo = await lookupGeo(
    capi.clientIpAddress ?? clientIpFromHeaders(headerList)
  );

  const externalId = text(payload.externalId, 255);
  const testEventCode = text(process.env.META_TEST_EVENT_CODE, 64);

  const userData: Record<string, string> = {};
  if (userAgent) userData.client_user_agent = userAgent;
  if (capi.clientIpAddress) userData.client_ip_address = capi.clientIpAddress;
  if (capi.fbp) userData.fbp = capi.fbp;
  if (capi.fbc) userData.fbc = capi.fbc;

  // Normalize + hash exactly once, through the SDK, so Meta's appendix is kept.
  const pii = payload.userData;
  const hashed: Record<string, string | undefined> = {
    em: capi.hash(pii?.email, "email"),
    ph: capi.hash(pii?.phone, "phone"),
    fn: capi.hash(pii?.firstName, "first_name"),
    ln: capi.hash(pii?.lastName, "last_name"),
    ct:
      capi.hash(pii?.city, "city") ??
      capi.hash(city, "city") ??
      capi.hash(geo?.city, "city"),
    country: capi.hash(country, "country") ?? capi.hash(geo?.country, "country"),
    st: capi.hash(region, "state") ?? capi.hash(geo?.state, "state"),
    zp: capi.hash(geo?.postal, "zip_code"),
    external_id: capi.hash(externalId, "external_id"),
  };
  for (const [key, value] of Object.entries(hashed)) {
    if (value) userData[key] = value;
  }

  const eventName = META_EVENT[payload.name] ?? "CustomEvent";

  const body = {
    data: [
      {
        event_name: eventName,
        event_time: safeEventTime(payload.eventTime),
        event_id: text(payload.eventId, 128) ?? crypto.randomUUID(),
        action_source: "website",
        event_source_url:
          capi.eventSourceUrl ?? absoluteUrl(payload.url) ?? siteUrl,
        ...(capi.referrerUrl ? { referrer_url: capi.referrerUrl } : {}),
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
