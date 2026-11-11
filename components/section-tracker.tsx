"use client";

import * as React from "react";
import { track } from "@/lib/tracking";

export function SectionTrack({
  name,
  children,
  threshold = 0.4,
}: {
  name: string;
  children: React.ReactNode;
  threshold?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const startRef = React.useRef<number | null>(null);
  const viewedRef = React.useRef(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const flush = () => {
      if (startRef.current !== null) {
        const duration = Math.round(performance.now() - startRef.current);
        track(
          "section_engagement",
          { section: name, duration_ms: duration },
          undefined,
          { server: false }
        ).catch(() => {});
        startRef.current = null;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!viewedRef.current) {
              viewedRef.current = true;
              track("section_view", { section: name }, undefined, {
                server: false,
              }).catch(() => {});
            }
            if (startRef.current === null) {
              startRef.current = performance.now();
            }
          } else {
            flush();
          }
        }
      },
      { threshold }
    );

    observer.observe(node);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      flush();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [name, threshold]);

  return <div ref={ref}>{children}</div>;
}