import { cookies, headers } from "next/headers";
import {
  ParamBuilder,
  PlainDataObject,
  type PiiDataType,
} from "capi-param-builder-nodejs";

import { siteUrl } from "@/lib/site";
import { isIp } from "@/lib/tracking/ip";

const primaryDomain = (() => {
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return "devalon.dev";
  }
})();

function parseUrl(value: string | undefined): URL | undefined {
  if (!value) return undefined;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed
      : undefined;
  } catch {
    return undefined;
  }
}

function safeReferer(value: string | null): string | null {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

/** Last-resort `fbc` when the `_fbc` cookie was not persisted by the SDK. */
function fbcFromQuery(queryParams: Record<string, string>): string | undefined {
  const fbclid = queryParams.fbclid;
  if (!fbclid || !/^[A-Za-z0-9_-]{1,256}$/.test(fbclid)) return undefined;
  return `fb.1.${Date.now()}.${fbclid}`;
}

export interface CapiParams {
  fbc?: string;
  fbp?: string;
  clientIpAddress?: string;
  eventSourceUrl?: string;
  referrerUrl?: string;
  hash: (value: string | undefined, type: PiiDataType) => string | undefined;
}

/**
 * Build the Meta match keys from the incoming request. A fresh builder is
 * created per request because the SDK keeps per-request state.
 */
export async function buildCapiParams(url: string | undefined): Promise<CapiParams> {
  const builder = new ParamBuilder([primaryDomain, "localhost"]);
  const headerList = await headers();
  const cookieStore = await cookies();
  const requestUrl = parseUrl(url);

  const queryParams: Record<string, string> = {};
  requestUrl?.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  const requestCookies: Record<string, string> = {};
  for (const cookie of cookieStore.getAll()) {
    requestCookies[cookie.name] = cookie.value;
  }

  const context = new PlainDataObject(
    requestUrl?.host ?? headerList.get("host") ?? primaryDomain,
    queryParams,
    requestCookies,
    safeReferer(headerList.get("referer")),
    headerList.get("x-forwarded-for"),
    headerList.get("x-real-ip"),
    requestUrl?.protocol.replace(":", "") ??
      headerList.get("x-forwarded-proto") ??
      "https",
    requestUrl ? `${requestUrl.pathname}${requestUrl.search}` : null
  );

  for (const cookie of builder.processRequestFromContext(context)) {
    const name = cookie.name.replace(/^\./, "");
    const domain = cookie.domain?.replace(/^\./, "");
    const usableDomain =
      domain && domain !== "localhost" && !isIp(domain) ? domain : undefined;

    try {
      cookieStore.set(name, cookie.value, {
        path: "/",
        maxAge: cookie.maxAge,
        sameSite: "lax",
        ...(usableDomain ? { domain: usableDomain } : {}),
      });
    } catch {
      // Best effort — the client-side SDK has usually already set these.
    }
  }

  return {
    fbc: builder.getFbc() ?? fbcFromQuery(queryParams) ?? undefined,
    fbp: builder.getFbp() ?? undefined,
    clientIpAddress: builder.getClientIpAddress() ?? undefined,
    eventSourceUrl: builder.getEventSourceUrl() ?? undefined,
    referrerUrl: builder.getReferrerUrl() ?? undefined,
    hash: (value, type) => {
      if (!value) return undefined;
      return builder.getNormalizedAndHashedPII(value, type) ?? undefined;
    },
  };
}
