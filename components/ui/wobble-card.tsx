"use client";
import React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
  noise = true,
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  noise?: boolean;
}) => {
  // motion values feed the inline styles directly, so mouse movement never
  // re-renders the card (there can be ~30 of these mounted at once)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const invX = useTransform(x, (v) => -v);
  const invY = useTransform(y, (v) => -v);
  const outerTransform = useMotionTemplate`translate3d(${x}px, ${y}px, 0) scale3d(1, 1, 1)`;
  const innerTransform = useMotionTemplate`translate3d(${invX}px, ${invY}px, 0) scale3d(${scale}, ${scale}, 1)`;

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((clientX - (rect.left + rect.width / 2)) / 20);
    y.set((clientY - (rect.top + rect.height / 2)) / 20);
  };
  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => scale.set(1.03)}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
        scale.set(1);
      }}
      style={{
        transform: outerTransform,
        transition: "transform 0.1s ease-out",
      }}
      className={cn(
        "mx-auto w-full bg-indigo-800  relative rounded-2xl overflow-hidden",
        containerClassName
      )}
    >
      <div
        className="relative  h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))]  sm:mx-0 sm:rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)",
        }}
      >
        <motion.div
          style={{
            transform: innerTransform,
            transition: "transform 0.1s ease-out",
          }}
          className={cn("h-full px-4 py-20 sm:px-10", className)}
        >
          {noise && <Noise />}
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};

const Noise = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
      style={{
        backgroundImage: "url(/noise.webp)",
        backgroundSize: "30%",
      }}
    ></div>
  );
};
