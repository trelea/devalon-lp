/** Shared IP helpers for the client IP endpoint and the CAPI parameter builder. */

export function isIp(value: string): boolean {
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(value)) {
    return value.split(".").every((part) => Number(part) <= 255);
  }
  return /^[0-9a-f:]+$/i.test(value) && value.includes(":");
}

export function isNonRoutable(value: string): boolean {
  return (
    value === "::1" ||
    value === "0.0.0.0" ||
    /^127\./.test(value) ||
    /^10\./.test(value) ||
    /^192\.168\./.test(value) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(value) ||
    /^169\.254\./.test(value) ||
    /^f[cd][0-9a-f]{2}:/i.test(value) ||
    /^fe80:/i.test(value)
  );
}

export function isPublicIp(value: string): boolean {
  return isIp(value) && !isNonRoutable(value);
}

/** Strip brackets and an optional port; return only routable addresses. */
function cleanIp(raw: string): string | undefined {
  let ip = raw.trim();
  if (ip.startsWith("[")) {
    const end = ip.indexOf("]");
    if (end === -1) return undefined;
    ip = ip.slice(1, end);
  } else if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(ip)) {
    ip = ip.replace(/:\d+$/, "");
  }
  return isPublicIp(ip) ? ip : undefined;
}

/** Prefer a public IPv6 address, falling back to IPv4. */
export function clientIpFromHeaders(headerList: Headers): string | undefined {
  const candidates: string[] = [];
  for (const name of [
    "cf-connecting-ip",
    "x-forwarded-for",
    "x-vercel-forwarded-for",
    "x-real-ip",
  ]) {
    const value = headerList.get(name);
    if (value) candidates.push(...value.split(","));
  }

  const addresses = candidates
    .map(cleanIp)
    .filter((value): value is string => Boolean(value));

  return addresses.find((value) => value.includes(":")) ?? addresses[0];
}
