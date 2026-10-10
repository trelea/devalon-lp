"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
} from "react";
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

import { cn } from "@/lib/utils";

// Count-up number that starts when scrolled into view.
// Adapted from Magic UI's number-ticker (motion-based, no extra deps).
// Honors prefers-reduced-motion by rendering the final value immediately.
type NumberTickerProps = ComponentPropsWithoutRef<"span"> & {
  value: number;
  startValue?: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
};

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(
    direction === "down" ? value : startValue,
  );
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const format = useCallback(
    (n: number) =>
      Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(Number(n.toFixed(decimalPlaces))),
    [decimalPlaces],
  );

  useEffect(() => {
    if (!isInView) return;
    if (reduceMotion) {
      if (ref.current) ref.current.textContent = format(value);
      return;
    }
    const timer = setTimeout(
      () => {
        motionValue.set(direction === "down" ? startValue : value);
      },
      delay * 1000,
    );
    return () => clearTimeout(timer);
  }, [motionValue, isInView, delay, value, direction, startValue, reduceMotion, format]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) ref.current.textContent = format(latest);
      }),
    [springValue, format],
  );

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums", className)}
      {...props}
    >
      {format(startValue)}
    </span>
  );
}
