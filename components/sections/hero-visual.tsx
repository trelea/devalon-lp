"use client"

import React, { forwardRef, useRef } from "react"
import { motion } from "motion/react"
import {
  BrainCircuit,
  Cloud,
  Database,
  Globe,
  Monitor,
  Server,
  Smartphone,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { Terminal } from "@/components/ui/terminal"

const BRAND_BLUE = "#2563eb"
const BRAND_INDIGO = "#60a5fa"

const Node = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; label?: string }
>(({ className, children, label }, ref) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-9 items-center justify-center sm:size-11",
          className,
        )}
      >
        {children}
      </div>
      {label && (
        <span className="text-[10px] font-medium text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  )
})

Node.displayName = "Node"

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<HTMLDivElement>(null)
  const webRef = useRef<HTMLDivElement>(null)
  const aiRef = useRef<HTMLDivElement>(null)
  const hubRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<HTMLDivElement>(null)
  const dbRef = useRef<HTMLDivElement>(null)
  const cloudRef = useRef<HTMLDivElement>(null)

  return (
    <div className="mx-auto w-full max-w-xl [perspective:1600px]">
      <motion.div
        style={{
          rotateX: 7,
          rotateY: -13,
          rotateZ: 2,
          transformStyle: "preserve-3d",
        }}
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Terminal
          sequence={false}
          className="dark max-h-none w-full max-w-none bg-card/95 shadow-2xl shadow-black/50 backdrop-blur-sm"
          aria-hidden
        >
      {/* animation canvas */}
      <div
        ref={containerRef}
        className="relative flex h-[220px] w-full items-center justify-center overflow-hidden p-2 sm:h-[360px]"
      >
        {/* soft glow behind the composition */}
        <div className="absolute top-1/2 left-1/2 -z-10 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.08] blur-3xl" />

        <div className="flex size-full max-h-[190px] max-w-md flex-col items-stretch justify-between sm:max-h-[280px]">
          <div className="flex flex-row items-center justify-between">
            <Node ref={appRef} label="Mobile app">
              <Smartphone
                className="size-7 text-foreground/80 sm:size-8"
                strokeWidth={1.25}
              />
            </Node>
            <Node ref={apiRef} label="API">
              <Server className="size-7 text-foreground/80 sm:size-8" strokeWidth={1.25} />
            </Node>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Node ref={webRef} label="Web">
              <Monitor className="size-7 text-foreground/80 sm:size-8" strokeWidth={1.25} />
            </Node>
            <Node ref={hubRef} className="size-12 sm:size-16">
              <Globe
                className="size-full text-primary drop-shadow-[0_0_14px_rgba(37,99,235,0.30)]"
                strokeWidth={1}
              />
            </Node>
            <Node ref={dbRef} label="Database">
              <Database
                className="size-7 text-foreground/80 sm:size-8"
                strokeWidth={1.25}
              />
            </Node>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Node ref={aiRef} label="AI">
              <BrainCircuit
                className="size-7 text-foreground/80 sm:size-8"
                strokeWidth={1.25}
              />
            </Node>
            <Node ref={cloudRef} label="Cloud">
              <Cloud className="size-7 text-foreground/80 sm:size-8" strokeWidth={1.25} />
            </Node>
          </div>
        </div>

        <AnimatedBeam
          containerRef={containerRef}
          fromRef={appRef}
          toRef={hubRef}
          curvature={-75}
          endYOffset={-10}
          gradientStartColor={BRAND_BLUE}
          gradientStopColor={BRAND_INDIGO}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={webRef}
          toRef={hubRef}
          gradientStartColor={BRAND_BLUE}
          gradientStopColor={BRAND_INDIGO}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={aiRef}
          toRef={hubRef}
          curvature={75}
          endYOffset={10}
          gradientStartColor={BRAND_BLUE}
          gradientStopColor={BRAND_INDIGO}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={apiRef}
          toRef={hubRef}
          curvature={-75}
          endYOffset={-10}
          reverse
          gradientStartColor={BRAND_INDIGO}
          gradientStopColor={BRAND_BLUE}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={dbRef}
          toRef={hubRef}
          reverse
          gradientStartColor={BRAND_INDIGO}
          gradientStopColor={BRAND_BLUE}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={cloudRef}
          toRef={hubRef}
          curvature={75}
          endYOffset={10}
          reverse
          gradientStartColor={BRAND_INDIGO}
          gradientStopColor={BRAND_BLUE}
        />
          </div>
        </Terminal>
      </motion.div>
    </div>
  )
}
