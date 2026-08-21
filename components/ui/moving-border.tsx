"use client";
import React, { useRef } from "react";
import { motion } from "motion/react";
import { useAnimationGate } from "@/lib/use-animation-gate";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        "relative h-16 w-40 overflow-hidden bg-transparent p-[1px] text-xl",
        containerClassName,
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder
          duration={duration}
          borderRadius={`calc(${borderRadius} * 0.96)`}
        >
          <div
            className={cn(
              "h-20 w-20 bg-[radial-gradient(#0ea5e9_40%,transparent_60%)] opacity-[0.8]",
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900/[0.8] text-sm text-white antialiased",
          className,
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

/**
 * Traces the border with CSS `offset-path: rect(...)` (same technique as
 * border-beam.tsx). The previous SVG version called getPointAtLength() twice
 * per frame per button — forced geometry work Firefox handles poorly with
 * several buttons animating at once.
 */
export const MovingBorder = ({
  children,
  duration = 3000,
  borderRadius = "30%",
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  borderRadius?: string;
  [key: string]: any;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useAnimationGate(ref);

  return (
    <div ref={ref} className="absolute inset-0" {...otherProps}>
      {inView && (
        <motion.div
          className="absolute top-0 left-0 inline-block"
          style={{
            offsetPath: `rect(0 auto auto 0 round ${borderRadius})`,
          }}
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: duration / 1000,
          }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};
