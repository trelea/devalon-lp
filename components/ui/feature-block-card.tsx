"use client"

import React, { useEffect, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { animate, motion } from "motion/react"

import { useAnimationGate } from "@/lib/use-animation-gate"
import { cn } from "@/lib/utils"

export const FeatureCard = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border border-border bg-card/40 p-5 sm:p-8",
        className
      )}
    >
      {children}
    </div>
  )
}

export const FeatureCardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h3
      className={cn(
        "mt-4 text-xl font-medium tracking-tight text-foreground sm:text-2xl",
        className
      )}
    >
      {children}
    </h3>
  )
}

export const FeatureCardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <p
      className={cn(
        "mt-1.5 text-base font-light leading-snug text-muted-foreground sm:mt-2.5 sm:text-lg sm:leading-relaxed",
        className
      )}
    >
      {children}
    </p>
  )
}

export const FeatureCardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string
  children: React.ReactNode
  showGradient?: boolean
}) => {
  return (
    <div
      className={cn(
        "z-40 h-[11rem] rounded-xl sm:h-[13rem]",
        className,
        showGradient &&
          "bg-muted/60 [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
      )}
    >
      {children}
    </div>
  )
}

const Container = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        `flex h-16 w-16 items-center justify-center rounded-full bg-card
    shadow-[0px_0px_0px_1px_rgba(15,23,42,0.06),0px_16px_20px_-12px_rgba(15,23,42,0.18)]
    `,
        className
      )}
    >
      {children}
    </div>
  )
}

const Sparkles = () => {
  // positions are random, so render only after mount to avoid an
  // SSR/client hydration mismatch
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // positions stay fixed; the twinkle animates transform/opacity only
  // (top/left animations force a layout pass per frame per star)
  const [stars] = useState(() =>
    Array.from({ length: 8 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      x: Math.random() * 4 - 2,
      y: Math.random() * 4 - 2,
      opacity: Math.random(),
      duration: Math.random() * 2 + 4,
    }))
  )

  if (!mounted) return null
  return (
    <div className="absolute inset-0">
      {stars.map((star, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            x: star.x,
            y: star.y,
            opacity: star.opacity,
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: star.top,
            left: star.left,
            width: `2px`,
            height: `2px`,
            borderRadius: "50%",
            zIndex: 1,
          }}
          className="inline-block bg-foreground"
        ></motion.span>
      ))}
    </div>
  )
}

// icon blur grows toward the edges for a depth-of-field feel; the center stays sharp
const circleSizes = [
  "h-10 w-10 [&_svg]:size-5 [&_svg]:blur-[2px]",
  "h-14 w-14 [&_svg]:size-7 [&_svg]:blur-[1px]",
  "h-18 w-18 [&_svg]:size-9",
  "h-14 w-14 [&_svg]:size-7 [&_svg]:blur-[1px]",
  "h-10 w-10 [&_svg]:size-5 [&_svg]:blur-[2px]",
]

export const FeatureCardSkeleton = ({
  icons,
  scope,
}: {
  icons: LucideIcon[]
  // unique per card — motion's animate() resolves selectors document-wide,
  // so multiple cards on one page need distinct class names
  scope: string
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useAnimationGate(containerRef)
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null)

  useEffect(() => {
    const scale = [1, 1.1, 1]
    const transform = [
      "translateY(0px)",
      "translateY(-4px)",
      "translateY(0px)",
    ]
    const sequence = icons.map((_, i) => [
      `.${scope}-circle-${i + 1}`,
      { scale, transform },
      { duration: 0.8 },
    ])

    // @ts-expect-error - motion sequence typing is looser than its runtime API
    const controls = animate(sequence, { repeat: Infinity, repeatDelay: 1 })
    controlsRef.current = controls
    return () => {
      controls.stop()
      controlsRef.current = null
    }
  }, [icons, scope])

  // pause the icon loop (and, via data-animation-paused, the CSS beam)
  // while the card is off-screen
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    if (inView) {
      controls.play()
    } else {
      controls.pause()
    }
  }, [inView])

  return (
    <div
      ref={containerRef}
      data-animation-paused={!inView || undefined}
      className="relative flex h-full items-center justify-center overflow-hidden p-8"
    >
      {/* gradient def for the icon strokes; id is scoped per card to stay unique */}
      <svg aria-hidden className="absolute h-0 w-0">
        <defs>
          <linearGradient
            id={`${scope}-icon-gradient`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex shrink-0 flex-row items-center justify-center gap-2">
        {icons.map((Icon, i) => (
          <Container
            key={i}
            className={cn(circleSizes[i % circleSizes.length], `${scope}-circle-${i + 1}`)}
          >
            <Icon stroke={`url(#${scope}-icon-gradient)`} strokeWidth={1.5} />
          </Container>
        ))}
      </div>

      <div className="animate-move absolute top-16 z-40 m-auto h-32 w-px bg-gradient-to-b from-transparent via-primary to-transparent">
        <div className="absolute -left-10 top-1/2 h-32 w-10 -translate-y-1/2">
          {inView && <Sparkles />}
        </div>
      </div>
    </div>
  )
}
