import type { EventParams } from "../events";

export function metaTrack(
  eventName: string,
  params?: EventParams,
  eventId?: string
) {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq !== "function") return;
  try {
    fbq("track", eventName, params ?? {}, eventId ? { eventID: eventId } : undefined);
  } catch {
    // no-op
  }
}