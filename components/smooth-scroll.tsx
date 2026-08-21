"use client"

import { MotionConfig } from "motion/react"

/**
 * Wraps the app in MotionConfig so every `motion` animation respects the OS
 * reduced-motion setting. Page scrolling is native; in-page #section links
 * glide via CSS `scroll-behavior: smooth` (see globals.css).
 */
export function SmoothScroll({ children }: { children?: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
