"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import { useAnimationGate } from "@/lib/use-animation-gate"

// Decorative neon half circle pinned to the left edge of its (overflow-hidden)
// parent. Picks a random vertical spot on each load; hidden until placed so
// the SSR fallback position never flashes. Neon animation borrowed from Magic
// UI's Neon Gradient Card: a 100%x200% two-color gradient whose
// background-position swings top<->bottom, once sharp for the rim and once
// blurred for the glow. The whole circle breathes on a slow pulse.
export function NeonHalfCircle() {
  const [top, setTop] = useState<number | null>(null)
  const reducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useAnimationGate(containerRef)
  const still = reducedMotion || !inView

  useEffect(() => {
    setTop(18 + Math.random() * 54)
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden
      data-animation-paused={!inView || undefined}
      className="pointer-events-none absolute inset-0 -z-10 hidden transition-opacity duration-1000 sm:block"
      style={{ opacity: top === null ? 0 : 1 }}
    >
      <motion.div
        className="absolute -left-28 size-56 -translate-y-1/2"
        style={{ top: `${top ?? 50}%` }}
        animate={{ scale: still ? 1 : [1, 1.05, 1] }}
        transition={
          still
            ? { duration: 0 }
            : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <motion.div
          className="absolute inset-0 animate-background-position-spin rounded-full bg-[linear-gradient(0deg,#2563eb,#7196e0)] bg-[length:100%_200%] blur-2xl"
          animate={{ opacity: still ? 0.5 : [0.4, 0.68, 0.4] }}
          transition={
            still
              ? { duration: 0 }
              : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <div className="absolute inset-0 animate-background-position-spin rounded-full bg-[linear-gradient(0deg,#2563eb,#7196e0)] bg-[length:100%_200%]" />
        <div className="absolute inset-[3px] rounded-full bg-[oklch(0.165_0.014_259)]" />
      </motion.div>
    </div>
  )
}
