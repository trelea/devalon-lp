"use client";

import * as React from "react";
import { track } from "@/lib/tracking";

const MILESTONES = [25, 50, 75, 100];

export function ScrollDepthTracker() {
  React.useEffect(() => {
    const fired = new Set<number>();

    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (height <= 0) return;
      const percent = Math.round((scrollTop / height) * 100);
      for (const m of MILESTONES) {
        if (percent >= m && !fired.has(m)) {
          fired.add(m);
          track("scroll_depth", { percent: m }, undefined, {
            server: false,
          }).catch(() => {});
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}