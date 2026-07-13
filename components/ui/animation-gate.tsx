"use client"

import { useRef } from "react"

import { useAnimationGate } from "@/lib/use-animation-gate"

/**
 * Pauses all CSS animations inside it while off-screen (see the
 * [data-animation-paused] rule in globals.css). Safe to wrap server
 * component children.
 */
export function AnimationGate({
  className,
  style,
  children,
}: {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useAnimationGate(ref)

  return (
    <div
      ref={ref}
      data-animation-paused={!inView || undefined}
      className={className}
      style={style}
    >
      {children}
    </div>
  )
}
