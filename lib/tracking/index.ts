"use client";

import { buildContext } from "./context";
import { ensureParamBuilder } from "./param-builder-client";
import { META_EVENT, GTM_EVENT } from "./events";
import type { EventName, EventParams, UserData } from "./events";
import { metaTrack } from "./providers/meta-pixel";
import { gtmTrack } from "./providers/gtm";
import { capiTrack } from "./providers/capi";
import { getIdentifiedUser } from "./identified-user";

export type { EventName, EventParams, UserData };

export interface TrackOptions {
  server?: boolean;
}

export async function track(
  name: EventName,
  params?: EventParams,
  userData?: UserData,
  options?: TrackOptions
): Promise<void> {
  if (typeof window === "undefined") return;
  await ensureParamBuilder();
  const ctx = buildContext();

  metaTrack(META_EVENT[name], params, ctx.eventId);
  gtmTrack(GTM_EVENT[name], params);

  const server = options?.server !== false;
  if (server) {
    // PII captured from an earlier form submit in this tab also enriches
    // otherwise anonymous events such as ViewContent. Explicit data wins.
    const merged: UserData = { ...(getIdentifiedUser() ?? {}), ...(userData ?? {}) };
    capiTrack(name, params, merged, ctx).catch(() => {});
  }
}

export function trackPageView(params?: EventParams, userData?: UserData) {
  return track("page_view", params, userData);
}