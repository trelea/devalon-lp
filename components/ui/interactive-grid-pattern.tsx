"use client"

import React, { useId, useState } from "react"

import { cn } from "@/lib/utils"

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  squares?: [number, number]
  className?: string
  squaresClassName?: string
}

// The grid is a single <pattern>-filled rect instead of horizontal×vertical
// individual <rect>s (this component is mounted once per work slide, so per-cell
// nodes multiply fast). Hover is one highlight rect moved to the cell under the
// pointer; while inside the svg it sits under the cursor, so the caller's
// hover:fill-* class and the 1s fade-out on leave behave like the per-cell
// version did.
export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const id = useId()
  const [horizontal, vertical] = squares
  const [cell, setCell] = useState<{ x: number; y: number } | null>(null)

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) / width)
    const y = Math.floor((event.clientY - rect.top) / height)
    if (x < 0 || y < 0 || x >= horizontal || y >= vertical) return
    setCell((prev) => (prev?.x === x && prev?.y === y ? prev : { x, y }))
  }

  return (
    <svg
      width={width * horizontal}
      height={height * vertical}
      className={cn("absolute inset-0 h-full w-full", className)}
      onPointerMove={handlePointerMove}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            className="stroke-foreground/[0.05]"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {cell && (
        <rect
          x={cell.x * width}
          y={cell.y * height}
          width={width}
          height={height}
          className={cn(
            "fill-transparent stroke-foreground/[0.05] transition-[fill] duration-100 ease-in-out not-[&:hover]:duration-1000",
            squaresClassName
          )}
        />
      )}
    </svg>
  )
}
