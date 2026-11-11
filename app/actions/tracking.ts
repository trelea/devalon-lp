"use server";

import crypto from "node:crypto";
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
  if (userData.city) out.ct = sha256(userData.city);
  if (userData.country) out.country = sha256(userData.country);
  return out;
}

export async function sendCapiEvent(payload: TrackingPayload) {
  const pixelId =
    process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  const hashed = hashUserData(payload.userData);

  const body = {
    data: [
      {
        event_name: META_EVENT[payload.name],
        event_time: Math.floor(Date.now() / 1000),
        event_id: payload.eventId,
        action_source: "website",
        event_source_url: payload.url,
        user_data: {
          client_user_agent: payload.userAgent,
          fbp: payload.fbp,
          fbc: payload.fbc,
          ...hashed,
        },
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