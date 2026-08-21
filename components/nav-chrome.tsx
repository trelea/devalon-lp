"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

export function NavChrome({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  // keep the scrim mounted through its 500ms fade-out, then drop it entirely —
  // an invisible fixed layer still costs a composited surface in Firefox
  const [scrimMounted, setScrimMounted] = useState(false)
  const unmountTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 8
      setScrolled(next)
      if (next) {
        if (unmountTimer.current) {
          clearTimeout(unmountTimer.current)
          unmountTimer.current = null
        }
        setScrimMounted(true)
      } else if (!unmountTimer.current) {
        unmountTimer.current = setTimeout(() => {
          setScrimMounted(false)
          unmountTimer.current = null
        }, 500)
      }
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (unmountTimer.current) clearTimeout(unmountTimer.current)
    }
  }, [])

  return (
    <>
      {/* gradient scrim — fades from top to nothing, no hard edge. A plain
          gradient instead of backdrop-blur: Gecko re-blurs a masked backdrop
          layer on every scroll frame, which made scrolling laggy on Firefox. */}
      {scrimMounted && (
        <div
          aria-hidden
          className={cn(
            "absolute inset-x-0 top-0 h-[130%] bg-gradient-to-b from-background/95 via-background/60 via-55% to-transparent transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      <div
        className={cn(
          "relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 transition-[height] duration-300 sm:px-8 xl:max-w-[88rem]",
          scrolled ? "h-[76px]" : "h-[88px]",
        )}
      >
        {children}
      </div>
    </>
  )
}
