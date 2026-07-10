"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export function NavChrome({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      {/* gradient glass scrim — fades from top to nothing, no hard edge */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-[130%] transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 via-60% to-transparent" />
        <div
          className="absolute inset-0 backdrop-blur-lg"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 40%, transparent 95%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 40%, transparent 95%)",
          }}
        />
      </div>
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
