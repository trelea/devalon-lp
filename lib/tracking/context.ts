import { getExternalId } from "./visitor";

export interface TrackingContext {
  eventId: string;
  url: string;
  userAgent: string;
  externalId?: string;
  eventTime: number;
}

export function buildContext(): TrackingContext {
  const eventId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return {
    eventId,
    url: typeof window !== "undefined" ? window.location.href : "",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    externalId: getExternalId(),
    eventTime: Math.floor(Date.now() / 1000),
  };
}
