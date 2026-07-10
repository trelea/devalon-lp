"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import "lenis/dist/lenis.css"

/**
 * Buttery page scrolling via Lenis. Mounted once in the root layout.
 * - `anchors: true` makes the in-page #section links glide too.
 * - Skipped entirely for users who prefer reduced motion.
 * - Nested scrollers (contact dialog, country dropdown) opt out with
 *   `data-lenis-prevent`.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({
      anchors: true,
      autoRaf: true,
    })

    return () => {
      lenis.destroy()
    }
  }, [])

  return null
}
