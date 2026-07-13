"use client"

import { useInView } from "motion/react"

/**
 * True while `ref` is within 200px of the viewport. Used to pause
 * decorative infinite animations off-screen; the margin restarts them
 * just before they scroll back into view.
 */
export function useAnimationGate(ref: React.RefObject<Element | null>) {
  return useInView(ref, { margin: "200px 0px 200px 0px" })
}
