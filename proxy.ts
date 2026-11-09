import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const locales = routing.locales as readonly string[];
const defaultLocale = routing.defaultLocale as string;

function supportedLocale(value: string | null | undefined): string | null {
  if (!value) return null;
  const lower = value.toLowerCase();
  const exact = locales.find((l) => l.toLowerCase() === lower);
  if (exact) return exact;
  const lang = lower.split("-")[0];
  const byLang = locales.find((l) => l.toLowerCase() === lang);
  return byLang ?? null;
}

function fromAcceptLanguage(header: string | null): string | null {
  if (!header) return null;
  const parts = header
    .split(",")
    .map((p) => {
      const [tag, q] = p.trim().split(";q=");
      return { tag: tag.trim(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of parts) {
    const found = supportedLocale(tag);
    if (found) return found;
  }
  return null;
}

// Country (ISO 3166-1 alpha-2) → preferred locale among the 7 supported.
const COUNTRY_TO_LOCALE: Record<string, string> = {
  RO: "ro",
  MD: "ro",
  RU: "ru",
  BY: "ru",
  KZ: "ru",
  KG: "ru",
  UZ: "ru",
  TJ: "ru",
  TM: "ru",
  AZ: "ru",
  AM: "ru",
  GE: "ru",
  UA: "ru",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  VE: "es",
  UY: "es",
  PY: "es",
  BO: "es",
  EC: "es",
  GT: "es",
  HN: "es",
  SV: "es",
  NI: "es",
  CR: "es",
  PA: "es",
  DO: "es",
  CU: "es",
  PR: "es",
  GQ: "es",
  DK: "da",
  GL: "da",
  FO: "da",
  DE: "de",
  AT: "de",
  CH: "de",
  LI: "de",
  FR: "fr",
  BE: "fr",
  LU: "fr",
  MC: "fr",
  CA: "fr",
  SN: "fr",
  CI: "fr",
  CM: "fr",
  MG: "fr",
  ML: "fr",
  BF: "fr",
  NE: "fr",
  TD: "fr",
  CG: "fr",
  CD: "fr",
  GA: "fr",
  GN: "fr",
  BJ: "fr",
  TG: "fr",
  CF: "fr",
  RW: "fr",
  BI: "fr",
  DJ: "fr",
  KM: "fr",
  SC: "fr",
  HT: "fr",
  // English-speaking (and any unmapped) fall through to default "en"
  US: "en",
  GB: "en",
  AU: "en",
  NZ: "en",
  IE: "en",
  ZA: "en",
  IN: "en",
  SG: "en",
  PH: "en",
  NG: "en",
  KE: "en",
  GH: "en",
  PK: "en",
  LK: "en",
  MY: "en",
  HK: "en",
  MT: "en",
  CY: "en",
};

function detectLocale(request: NextRequest): string {
  // Layer 1: browser language (Accept-Language)
  const browser = fromAcceptLanguage(request.headers.get("accept-language"));
  if (browser) return browser;

  // Layer 2: device language (cookie set client-side, or Sec-CH-Lang)
  const deviceRaw =
    request.cookies.get("device-locale")?.value ||
    request.headers.get("sec-ch-lang");
  const device = supportedLocale(deviceRaw ?? null);
  if (device) return device;

  // Layer 3: actual locale where located (geo IP)
  const country =
    (request as { geo?: { country?: string } }).geo?.country ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry");
  if (country) {
    const geo = COUNTRY_TO_LOCALE[country.toUpperCase()];
    if (geo && locales.includes(geo)) return geo;
  }

  // Layer 4: fallback to English, always
  return defaultLocale;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already localized → let next-intl handle normalization/headers/cookie.
  const hasPrefix = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasPrefix) {
    return intlMiddleware(request);
  }

  // Unprefixed → detect locale and redirect (307 by default via NextResponse.redirect).
  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
