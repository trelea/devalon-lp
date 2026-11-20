import { getCookie, getExternalId, setCookie } from "./visitor";

export interface TrackingContext {
  eventId: string;
  url: string;
  userAgent: string;
  fbp?: string;
  fbc?: string;
  externalId?: string;
  eventTime: number;
}

/** `_fbc` normally comes from the pixel, but can be rebuilt from `?fbclid=`. */
function buildFbc(): string | undefined {
  const cookie = getCookie("_fbc");
  if (cookie) return cookie;

  if (typeof window === "undefined") return undefined;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return undefined;

  const fbc = `fb.1.${Date.now()}.${fbclid}`;
  setCookie("_fbc", fbc);
  return fbc;
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
    fbp: getCookie("_fbp"),
    fbc: buildFbc(),
    externalId: getExternalId(),
    eventTime: Math.floor(Date.now() / 1000),
  };
}
