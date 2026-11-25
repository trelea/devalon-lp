"use client";

import type { UserData } from "./events";

const STORAGE_KEY = "dv_tracking_pii";
const FIELDS: readonly (keyof UserData)[] = [
  "email",
  "phone",
  "firstName",
  "lastName",
  "city",
  "country",
];

/**
 * Remember the PII a visitor voluntarily submitted in a form so that later
 * events in the same tab (e.g. ViewContent) also carry it to CAPI. Stored in
 * sessionStorage only — it dies when the tab closes and is never persisted
 * across sessions.
 */
export function saveIdentifiedUser(data: UserData): void {
  if (typeof window === "undefined") return;
  const clean: UserData = {};
  for (const field of FIELDS) {
    const value = data[field];
    if (typeof value === "string" && value.trim()) clean[field] = value.trim();
  }
  if (!Object.keys(clean).length) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  } catch {
    // Storage disabled (private mode / quota) — tracking still works without it.
  }
}

export function getIdentifiedUser(): UserData | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return undefined;
    const source = parsed as Record<string, unknown>;
    const result: UserData = {};
    for (const field of FIELDS) {
      const value = source[field];
      if (typeof value === "string" && value.trim()) result[field] = value.trim();
    }
    return Object.keys(result).length ? result : undefined;
  } catch {
    return undefined;
  }
}

export function clearIdentifiedUser(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
