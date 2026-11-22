import { headers } from "next/headers";

import { clientIpFromHeaders } from "@/lib/tracking/ip";

export const dynamic = "force-dynamic";

/** Returns the visitor's public IP so the client-side SDK can store it in `_fbi`. */
export async function GET() {
  const ip = clientIpFromHeaders(await headers()) ?? "";

  return new Response(ip, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
