"use client";

/**
 * Thin browser wrapper around Meta's client-side parameter builder.
 *
 * `processAndCollectAllParams` writes `_fbc`, `_fbp` and (when `getIpFn`
 * resolves) `_fbi`. It must run once per page load, as early as possible, so
 * downstream pixel and CAPI events see the same first-party cookie values.
 */

type ClientParamBuilder = {
  processAndCollectAllParams(
    url: string | null,
    getIpFn?: () => string | Promise<string>
  ): Promise<Record<string, string>>;
  getFbc(): string;
  getFbp(): string;
  getClientIpAddress(): string;
};

let sdkPromise: Promise<ClientParamBuilder> | undefined;
let initPromise: Promise<void> | undefined;

function loadSdk(): Promise<ClientParamBuilder> {
  if (!sdkPromise) {
    sdkPromise = import("meta-capi-param-builder-clientjs").then((mod) => {
      const loaded = mod as { default?: ClientParamBuilder };
      return loaded.default ?? (mod as unknown as ClientParamBuilder);
    });
  }
  return sdkPromise;
}

async function fetchClientIp(): Promise<string | undefined> {
  try {
    const response = await fetch("/api/ip", { cache: "no-store" });
    return (await response.text()).trim() || undefined;
  } catch {
    return undefined;
  }
}

/** Idempotent: repeated calls reuse the same in-flight/completed collection. */
export function ensureParamBuilder(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!initPromise) {
    initPromise = loadSdk()
      .then(async (sdk) => {
        // Omit `getIpFn` entirely when there is no public IP (e.g. localhost),
        // otherwise the SDK logs an "Invalid IP" error for every page load.
        const ip = await fetchClientIp();
        return sdk.processAndCollectAllParams(
          window.location.href,
          ip ? () => ip : undefined
        );
      })
      .then(() => undefined)
      .catch(() => undefined);
  }
  return initPromise;
}
