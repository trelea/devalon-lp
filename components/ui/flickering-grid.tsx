"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  className?: string
  maxOpacity?: number
}

// Opacities are quantized into a fixed set of precomputed fillStyle strings so
// the draw loop never builds a string per square. Squares that flicker are
// redrawn individually; a full-canvas redraw only happens on setup/resize.
// Firefox's Canvas2D per-call overhead made the previous redraw-everything
// approach (~16k fillRects/frame on a full section) the page's hottest loop.
const OPACITY_BUCKETS = 32

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  const memoizedColor = useMemo(() => {
    const toRGBA = (color: string) => {
      if (typeof window === "undefined") {
        return `rgba(0, 0, 0,`
      }
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = 1
      const ctx = canvas.getContext("2d")
      if (!ctx) return "rgba(255, 0, 0,"
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
      return `rgba(${r}, ${g}, ${b},`
    }
    return toRGBA(color)
  }, [color])

  const fillStyles = useMemo(
    () =>
      Array.from(
        { length: OPACITY_BUCKETS },
        (_, i) =>
          `${memoizedColor}${((i / (OPACITY_BUCKETS - 1)) * maxOpacity).toFixed(4)})`
      ),
    [memoizedColor, maxOpacity]
  )

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      const cols = Math.ceil(width / (squareSize + gridGap))
      const rows = Math.ceil(height / (squareSize + gridGap))

      // each square stores its opacity-bucket index
      const squares = new Uint8Array(cols * rows)
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.floor(Math.random() * OPACITY_BUCKETS)
      }

      return { cols, rows, squares, dpr }
    },
    [squareSize, gridGap]
  )

  const drawCell = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      col: number,
      row: number,
      bucket: number,
      dpr: number
    ) => {
      const x = col * (squareSize + gridGap) * dpr
      const y = row * (squareSize + gridGap) * dpr
      const size = squareSize * dpr
      ctx.clearRect(x, y, size, size)
      ctx.fillStyle = fillStyles[bucket]
      ctx.fillRect(x, y, size, size)
    },
    [fillStyles, squareSize, gridGap]
  )

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Uint8Array,
      dpr: number
    ) => {
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          drawCell(ctx, i, j, squares[i * rows + j], dpr)
        }
      }
    },
    [drawCell]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const ctx = canvas?.getContext("2d") ?? null
    let animationFrameId: number | null = null
    let resizeObserver: ResizeObserver | null = null
    let intersectionObserver: IntersectionObserver | null = null
    let gridParams: ReturnType<typeof setupCanvas> | null = null

    if (canvas && container && ctx) {
      const updateCanvasSize = () => {
        const newWidth = width || container.clientWidth
        const newHeight = height || container.clientHeight
        setCanvasSize({ width: newWidth, height: newHeight })
        gridParams = setupCanvas(canvas, newWidth, newHeight)
        drawGrid(
          ctx,
          canvas.width,
          canvas.height,
          gridParams.cols,
          gridParams.rows,
          gridParams.squares,
          gridParams.dpr
        )
      }

      updateCanvasSize()

      let lastTime = 0
      const animate = (time: number) => {
        if (!isInView || !gridParams) return

        // clamp so a background-tab pause doesn't flip every square at once
        const deltaTime = Math.min((time - lastTime) / 1000, 0.064)
        lastTime = time

        const { rows, squares, dpr } = gridParams
        const chance = flickerChance * deltaTime
        for (let i = 0; i < squares.length; i++) {
          if (Math.random() < chance) {
            squares[i] = Math.floor(Math.random() * OPACITY_BUCKETS)
            drawCell(ctx, Math.floor(i / rows), i % rows, squares[i], dpr)
          }
        }
        animationFrameId = requestAnimationFrame(animate)
      }

      resizeObserver = new ResizeObserver(() => {
        updateCanvasSize()
      })
      resizeObserver.observe(container)

      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting)
        },
        { threshold: 0 }
      )
      intersectionObserver.observe(canvas)

      if (isInView) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect()
      }
    }
  }, [setupCanvas, drawGrid, drawCell, flickerChance, width, height, isInView])

  return (
    <div ref={containerRef} className={cn(`h-full w-full ${className}`)} {...props}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  )
}
