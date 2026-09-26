"use client"

import { useEffect } from "react"
import { MotionConfig } from "motion/react"
import Lenis from "lenis"

/**
 * Global motion smooth scroll (Lenis) + reduced-motion-aware MotionConfig.
 * Lenis is skipped when the OS requests reduced motion (native scroll then).
 * The instance is exposed as window.__lenis for anchor links (see nav-link).
 */
export function SmoothScroll({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      delete (window as unknown as { __lenis?: Lenis }).__lenis
    }
  }, [])

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
