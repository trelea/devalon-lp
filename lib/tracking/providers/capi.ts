import type { EventName, EventParams, UserData } from "../events";
import type { TrackingContext } from "../context";
import { sendCapiEvent } from "@/app/actions/tracking";

export async function capiTrack(
  name: EventName,
  params: EventParams | undefined,
  userData: UserData | undefined,
  ctx: TrackingContext
) {
  try {
    await sendCapiEvent({
      name,
      params,
      userData,
      eventId: ctx.eventId,
      url: ctx.url,
      userAgent: ctx.userAgent,
      fbp: ctx.fbp,
      fbc: ctx.fbc,
    });
  } catch {
    // no-op
  }
}