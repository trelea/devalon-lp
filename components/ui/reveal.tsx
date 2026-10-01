"use client"

import { motion } from "motion/react"

import { AuroraText } from "@/components/ui/aurora-text"

export function WordReveal({
  text,
  accentFrom,
  auroraFrom,
  auroraColors = ["#3B4354", "#4e6cb8", "#7196E0", "#5b7fd4"],
  auroraSpeed = 1,
  wordClassName = "mr-[0.25em] inline-block",
  accentClassName = "text-primary",
}: {
  text: string
  accentFrom?: number
  auroraFrom?: number
  auroraColors?: string[]
  auroraSpeed?: number
  wordClassName?: string
  accentClassName?: string
}) {
  return (
    <>
      {text.split(" ").map((word, index) => {
        const isAurora = auroraFrom !== undefined && index >= auroraFrom
        const isAccent =
          !isAurora && accentFrom !== undefined && index >= accentFrom
        return (
          <motion.span
            key={index}
            initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.3 + index * 0.08,
              ease: "easeInOut",
            }}
            className={
              isAccent
                ? `${wordClassName} ${accentClassName}`
                : wordClassName
            }
          >
            {isAurora ? (
              <AuroraText
                colors={auroraColors}
                speed={auroraSpeed}
                className="pb-[0.08em]"
              >
                {word}
              </AuroraText>
            ) : (
              word
            )}
          </motion.span>
        )
      })}
    </>
  )
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.3,
  scale = false,
  className,
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  scale?: boolean
  className?: string
}) {
  return (
    <motion.div
      initial={scale ? { opacity: 0, scale: 0.96 } : { opacity: 0 }}
      animate={scale ? { opacity: 1, scale: 1 } : { opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
