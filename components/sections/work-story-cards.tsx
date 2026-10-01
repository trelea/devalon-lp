"use client";

import { Fragment, useMemo, useRef, useSyncExternalStore } from "react";
import { motion, useInView, type Variants } from "motion/react";
import { Compass, Rocket } from "lucide-react";

import { DotPattern } from "@/components/ui/dot-pattern";
import { useAnimationGate } from "@/lib/use-animation-gate";

// One observer for the whole paragraph; the per-word cascade comes from
// staggerChildren instead of one viewport per word.
const containerVariants: Variants = {
  hidden: { transition: { staggerChildren: 0.012, delayChildren: 0.05 } },
  visible: { transition: { staggerChildren: 0.012, delayChildren: 0.05 } },
};

// No vertical offset: a transform would lift a word out of its line box and
// make unrevealed rows sit visibly lower than the rows above them.
const wordVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.28, ease: "easeOut" },
  },
};

// false on the server, true after hydration — lets the paragraph render
// fully visible in the SSR HTML instead of hidden behind the reveal.
const emptySubscribe = () => () => {};
const useIsHydrated = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

function WordReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const hydrated = useIsHydrated();
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  return (
    <motion.p
      ref={ref}
      className={className}
      variants={containerVariants}
      initial={false}
      animate={!hydrated || inView ? "visible" : "hidden"}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <motion.span className="inline-block" variants={wordVariants}>
            {word}
          </motion.span>
          {/* the space must sit between the spans: trailing whitespace inside
              an inline-block is collapsed away at the end of the line box */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.p>
  );
}

export function WorkStoryCards({
  challenge,
  solution,
}: {
  challenge?: string;
  solution?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useAnimationGate(containerRef);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm"
    >
      {/* aurora glow on the solution side */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2"
        style={{
          background:
            "radial-gradient(70% 90% at 65% 15%, rgba(78,108,184,0.22) 0%, rgba(78,108,184,0.08) 40%, transparent 70%)",
        }}
      />

      <div className="relative grid md:grid-cols-2">
        {/* ── challenge (dark) ──────────────────────────── */}
        <div className="relative border-b border-white/10 bg-gradient-to-br from-[#1e3a5f] via-[#2d4a7a] to-[#1e3a5f] p-8 sm:p-10 md:min-h-[32rem] md:border-r md:border-b-0 lg:min-h-[34rem]">
          <DotPattern
            width={18}
            height={18}
            cr={1}
            className="text-white/[0.14]"
          />
          {/* ghost numeral */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-4 right-6 text-[7rem] leading-none font-bold tracking-tighter text-white/10 select-none sm:text-[9rem]"
          >
            01
          </span>

          <div className="relative">
            <div className="flex items-center gap-3">
              <Compass
                className="size-8 shrink-0 text-[#7196e0] sm:size-9"
                strokeWidth={1.5}
              />
              <p className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Challenge
              </p>
            </div>
            {challenge && (
              <WordReveal
                text={challenge}
                className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg"
              />
            )}
          </div>
        </div>

        {/* ── solution (light) ──────────────────────────── */}
        <div className="relative p-8 sm:p-10 md:min-h-[32rem] lg:min-h-[34rem]">
          {/* ghost numeral */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-4 right-6 text-[7rem] leading-none font-bold tracking-tighter text-primary/10 select-none sm:text-[9rem]"
          >
            02
          </span>

          <div className="relative">
            <div className="flex items-center gap-3">
              <Rocket
                className="size-8 shrink-0 text-primary sm:size-9"
                strokeWidth={1.5}
              />
              <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Solution
              </p>
            </div>
            {solution && (
              <WordReveal
                text={solution}
                className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg"
              />
            )}
          </div>
        </div>
      </div>

      {/* ── animated pulse on the divider ──────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 md:block"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7196e0]/40 to-transparent" />
        {inView && (
          <motion.div
            className="absolute left-1/2 h-10 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#4e6cb8] to-[#7196E0] shadow-[0_0_14px_3px_rgba(113,150,224,0.55)]"
            animate={{ top: ["-10%", "110%"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>
    </div>
  );
}
