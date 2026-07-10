"use client"

import { motion } from "motion/react"

export function WordReveal({
  text,
  accentFrom,
  wordClassName = "mr-[0.25em] inline-block",
  accentClassName = "text-primary",
}: {
  text: string
  accentFrom?: number
  wordClassName?: string
  accentClassName?: string
}) {
  return (
    <>
      {text.split(" ").map((word, index) => (
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
            accentFrom !== undefined && index >= accentFrom
              ? `${wordClassName} ${accentClassName}`
              : wordClassName
          }
        >
          {word}
        </motion.span>
      ))}
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
