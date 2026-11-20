"use server";

import crypto from "node:crypto";
import { headers } from "next/headers";
import { META_EVENT } from "@/lib/tracking/events";
import type { TrackingPayload } from "@/lib/tracking/events";

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function hashUserData(userData?: TrackingPayload["userData"]) {
  if (!userData) return {};
  const out: Record<string, string> = {};
  if (userData.email) out.em = sha256(userData.email);
  if (userData.phone) out.ph = sha256(userData.phone.replace(/\D/g, ""));
  if (userData.firstName) out.fn = sha256(userData.firstName);
  if (userData.lastName) out.ln = sha256(userData.lastName);
  if (userData.city) out.ct = sha256(normalizeCity(userData.city));
  if (userData.country) out.country = sha256(userData.country);
  return out;
}

/** Meta wants city lowercased, without periods, commas or spaces. */
function normalizeCity(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,]/g, "")
    .replace(/\s+/g, "");
}

function decode(value: string | null): string | undefined {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Two-letter code only; drops Cloudflare placeholders like `T1` / `XX`. */
function twoLetterCode(value: string | null): string | undefined {
  const code = value?.trim();
  return code && /^[A-Za-z]{2}$/.test(code) ? code.toLowerCase() : undefined;
}

function clientIp(headerList: Headers): string | undefined {
  const cf = headerList.get("cf-connecting-ip")?.trim();
  if (cf) return cf;

  const forwarded = headerList.get("x-forwarded-for");
  // The first entry is the original visitor; later ones are proxies.
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first;

  return headerList.get("x-real-ip")?.trim() || undefined;
}

export async function sendCapiEvent(payload: TrackingPayload) {
  const pixelId =
    process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  const headerList = await headers();

  // These two must stay raw (never hashed) for Meta to match them.
  const ip = clientIp(headerList);
  const userAgent = headerList.get("user-agent")?.trim() || payload.userAgent;
  const country =
    twoLetterCode(headerList.get("cf-ipcountry")) ??
    twoLetterCode(headerList.get("x-vercel-ip-country"));
  const city = normalizeCity(
    decode(headerList.get("cf-ipcity")) ??
      decode(headerList.get("x-vercel-ip-city")) ??
      ""
  );
  const region =
    twoLetterCode(headerList.get("cf-region-code")) ??
    twoLetterCode(headerList.get("x-vercel-ip-country-region"));

  const userData: Record<string, string> = {
    ...hashUserData(payload.userData),
    ...(userAgent ? { client_user_agent: userAgent } : {}),
    ...(ip ? { client_ip_address: ip } : {}),
    ...(payload.fbp ? { fbp: payload.fbp } : {}),
    ...(payload.fbc ? { fbc: payload.fbc } : {}),
    ...(payload.externalId ? { external_id: sha256(payload.externalId) } : {}),
    ...(country ? { country: sha256(country) } : {}),
    ...(city ? { ct: sha256(city) } : {}),
    ...(region ? { st: sha256(region) } : {}),
  };

  const body = {
    data: [
      {
        event_name: META_EVENT[payload.name],
        event_time: payload.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: payload.eventId,
        action_source: "website",
        event_source_url: payload.url,
        user_data: userData,
        custom_data: payload.params ?? {},
      },
    ],
    access_token: accessToken,
    ...(process.env.META_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_TEST_EVENT_CODE }
      : {}),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    await fetch(`https://graph.facebook.com/v25.0/${pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    // no-op
  } finally {
    clearTimeout(timeout);
  }
}
