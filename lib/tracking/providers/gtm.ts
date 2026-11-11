export function gtmTrack(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
  if (!Array.isArray(dataLayer)) return;
  try {
    dataLayer.push({ event: eventName, ...(params ?? {}) });
  } catch {
    // no-op
  }
}