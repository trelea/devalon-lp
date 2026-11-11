"use client";

import * as React from "react";
import { track } from "@/lib/tracking";

export function TrackedClicks() {
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;

      // 1. Annotated CTA (highest priority)
      const tracked = target.closest?.("[data-track]") as HTMLElement | null;
      if (tracked) {
        track(
          "click_cta",
          {
            cta: tracked.dataset.track,
            project: tracked.dataset.trackProject,
            section: tracked.dataset.trackSection,
            location: tracked.dataset.trackLocation,
            label: tracked.textContent?.trim().slice(0, 80),
            href: (tracked as HTMLAnchorElement).href || undefined,
          },
          undefined,
          { server: false }
        ).catch(() => {});
        return;
      }

      const anchor = target.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor || !anchor.href) return;

      // 2. Phone / email clicks
      if (anchor.href.startsWith("tel:") || anchor.href.startsWith("mailto:")) {
        track(
          "contact_click",
          {
            type: anchor.href.startsWith("tel:") ? "phone" : "email",
            value: anchor.href.replace(/^(tel:|mailto:)/, ""),
            label: anchor.textContent?.trim().slice(0, 80),
          },
          undefined,
          { server: false }
        ).catch(() => {});
        return;
      }

      // 3. Outbound links
      try {
        const url = new URL(anchor.href);
        if (url.protocol.startsWith("http") && url.host !== window.location.host) {
          track(
            "outbound_click",
            {
              url: anchor.href,
              host: url.host,
              project: anchor.dataset.trackProject,
              label: anchor.textContent?.trim().slice(0, 80),
            },
            undefined,
            { server: false }
          ).catch(() => {});
        }
      } catch {
        // ignore invalid urls
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}