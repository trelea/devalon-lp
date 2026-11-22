"use client";

import { useEffect } from "react";

import { ensureParamBuilder } from "@/lib/tracking/param-builder-client";

/** Captures `_fbc`/`_fbp`/`_fbi` on page load, before any tracked event. */
export function ParamBuilder() {
  useEffect(() => {
    void ensureParamBuilder();
  }, []);

  return null;
}
