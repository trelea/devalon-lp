"use client";

import {
  Gauge,
  Globe,
  Layers,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

import { useEffect, useRef, useState } from "react";

import { useAnimationGate } from "@/lib/use-animation-gate";

/* ── random helpers ─────────────────────────────────────────── */

type Side = "top" | "bottom" | "left" | "right";
type Variant = "orbit" | "cluster" | "single";

type Decor = {
  side: Side;
  variant: Variant;
  icons: LucideIcon[];
  durations: number[];
  offsets: number[];
};

const SIDES: Side[] = ["top", "bottom", "left", "right"];
const VARIANTS: Variant[] = ["orbit", "cluster", "single"];

const randomSide = (): Side => SIDES[Math.floor(Math.random() * SIDES.length)]!;
const randomVariant = (): Variant =>
  VARIANTS[Math.floor(Math.random() * VARIANTS.length)]!;

const ICON_POOL: LucideIcon[] = [
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  Zap,
  ShieldCheck,
  Sparkles,
  Globe,
  Layers,
  Gauge,
  Rocket,
  Target,
];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
};

const makeDecor = (): Decor => ({
  side: randomSide(),
  variant: randomVariant(),
  icons: shuffle(ICON_POOL).slice(0, 4),
  durations: Array.from({ length: 4 }, () => 14 + Math.random() * 14),
  offsets: Array.from({ length: 4 }, () => Math.random() * 360),
});

const SIDE_CLASSES: Record<Side, string> = {
  top: "-top-16 left-1/2 -translate-x-1/2",
  bottom: "-bottom-16 left-1/2 -translate-x-1/2",
  left: "-left-16 top-1/2 -translate-y-1/2",
  right: "-right-16 top-1/2 -translate-y-1/2",
};

const CLUSTER_POSITIONS = [
  "top-8 left-6",
  "top-20 right-4",
  "bottom-16 left-14",
  "bottom-6 right-12",
  "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
];

/* ── component ───────────────────────────────────────────────── */

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    className?: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2", className)}>
      {items.map((item, idx) => (
        <div
          key={item.title}
          className={cn("group relative block h-full w-full p-2", item.className)}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 block h-full w-full rounded-2xl bg-gradient-to-br from-[#2d4a7a] via-[#3b5f9e] to-[#2d4a7a]"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            {item.icon && (
              <div className="flex size-11 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                {item.icon}
              </div>
            )}
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useAnimationGate(cardRef);

  // random config is picked only after mount — Math.random() during render
  // would differ between SSR and the client and break hydration
  const [decor, setDecor] = useState<Decor | null>(null);
  useEffect(() => {
    setDecor(makeDecor());
  }, []);

  return (
    <div
      ref={cardRef}
      data-animation-paused={!inView || undefined}
      className={cn(
        "relative z-20 h-full w-full overflow-hidden rounded-3xl border border-[#4e6cb8]/40 bg-gradient-to-br from-[#1e3a5f] via-[#2d4a7a] to-[#1e3a5f] shadow-[0_0_30px_-5px_rgba(30,58,95,0.3)] transition-all group-hover:border-[#7196e0]/80",
        className,
      )}
    >
      {decor && (
        <DecorLayer decor={decor} paused={!inView} />
      )}

      <div className="relative z-50">
        <div className="p-8 sm:p-10">{children}</div>
      </div>
    </div>
  );
};

function DecorLayer({
  decor,
  paused,
}: {
  decor: Decor;
  /** Stops the infinite loops while the card is off-screen. */
  paused?: boolean;
}) {
  const { side, variant, icons, durations, offsets } = decor;

  return (
    <div
      aria-hidden
      // one multiplier on the whole layer instead of lowering each token:
      // dropping the bubble fill on its own turns the icons into disembodied
      // marks and makes the ring more prominent, not less
      className={cn(
        "pointer-events-none absolute size-64 opacity-50",
        SIDE_CLASSES[side],
      )}
    >
      {/* glow */}
      <div
        className="absolute top-1/2 left-1/2 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(113,150,224,0.28) 0%, transparent 70%)",
        }}
      />

      {variant === "orbit" && (
        <>
          <div className="absolute top-1/2 left-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
          {icons.map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                rotate: `${offsets[i]}deg`,
              }}
              animate={paused ? undefined : { rotate: 360 }}
              transition={{
                duration: durations[i],
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div
                className="flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/10"
                style={{ transform: `translate(-50%, -50%) translateY(-72px)` }}
              >
                <Icon className="size-5 text-white/40" strokeWidth={1.25} />
              </div>
            </motion.div>
          ))}
        </>
      )}

      {variant === "cluster" &&
        icons.map((Icon, i) => (
          <motion.div
            key={i}
            className={cn("absolute", CLUSTER_POSITIONS[i])}
            animate={paused ? undefined : { y: [0, -8, 0] }}
            transition={{
              duration: durations[i] / 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
              <Icon className="size-5 text-white/40" strokeWidth={1.25} />
            </div>
          </motion.div>
        ))}

      {variant === "single" && (() => {
        const Icon = icons[0]!;
        return (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={paused ? undefined : { rotate: 360 }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="flex size-28 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <Icon className="size-12 text-white/40" strokeWidth={1} />
            </div>
          </motion.div>
        );
      })()}
    </div>
  );
}

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h3
      className={cn(
        "mt-5 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl",
        className,
      )}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-2.5 text-center text-lg leading-relaxed text-white/70 sm:text-xl",
        className,
      )}
    >
      {children}
    </p>
  );
};
