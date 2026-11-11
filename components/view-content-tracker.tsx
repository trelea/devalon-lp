"use client";

import { useEffect } from "react";
import { track } from "@/lib/tracking";

export function ViewContentTracker({ slug }: { slug: string }) {
  useEffect(() => {
    track("view_content", { content_name: slug, content_type: "work" });
  }, [slug]);
  return null;
}