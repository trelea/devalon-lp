"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  Building,
  Building2,
  Hammer,
  Heart,
  Home,
  Sparkles,
  Sun,
  TrendingUp,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { AuroraText } from "@/components/ui/aurora-text";
import { Button } from "@/components/ui/button";
import { LayoutGrid, type LayoutGridCard } from "@/components/ui/layout-grid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const AURORA_COLORS = ["#3B4354", "#4e6cb8", "#7196E0", "#5b7fd4"];
const AURORA_COLORS_ON_BLUE = ["#ffffff", "#e0e7ff", "#a8c4f0", "#7196E0"];

export type ProjectWithSrc = {
  num: string;
  slug: string;
  client: string;
  name: string;
  href?: string;
  body: string;
  challenge?: string;
  solution?: string;
  highlights?: string[];
  metrics?: { value: string; label: string }[];
  src: string;
  gallery?: string[];
  shotLabels?: string[];
};

const ICON_MAP: Record<string, LucideIcon> = {
  "2marketing": Sparkles,
  wynne: Home,
  megawind: Sun,
  dialogimobil: Building2,
  premierinvest: Building,
  dialoginvest: TrendingUp,
  etatruck: Truck,
  redcore: Hammer,
  palazzo: Heart,
};

function DialogLeft({
  project,
  Icon,
}: {
  project: ProjectWithSrc;
  Icon: LucideIcon;
}) {
  const hasChallenge = !!project.challenge;
  const hasSolution = !!project.solution;
  const tabs = [
    { key: "desc" as const, label: "Overview" },
    ...(hasChallenge ? [{ key: "challenge" as const, label: "Challenge" }] : []),
    ...(hasSolution ? [{ key: "solution" as const, label: "Solution" }] : []),
  ];
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("desc");
  const showTabs = tabs.length > 1;

  return (
    <div className="flex h-full flex-col overflow-visible lg:overflow-hidden">
      <div className="flex items-center gap-3 sm:gap-4">
        <Icon className="size-8 shrink-0 text-[#4e6cb8] sm:size-10" strokeWidth={2} />
        <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">
          <AuroraText colors={AURORA_COLORS} speed={1}>
            {project.name}
          </AuroraText>
        </h3>
      </div>
      <p className="mt-2 text-xs font-medium tracking-[0.14em] uppercase text-muted-foreground">
        {project.client}
      </p>

      {/* Desktop tabs — hidden on phones, visible md+ (PC untouched) */}
      <div className="hidden md:block">
        {showTabs ? (
          <div className="mt-6 inline-flex w-fit gap-1 rounded-full bg-zinc-100 p-1 sm:mt-8">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(t.key);
                }}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium transition sm:px-4 sm:text-sm",
                  active === t.key
                    ? "bg-white text-foreground shadow-sm ring-1 ring-zinc-200"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6 sm:mt-8" />
        )}

        <div className="mt-4 min-h-[96px] sm:min-h-[112px]">
          {active === "desc" && (
            <p className="max-w-2xl text-[17px] font-light leading-relaxed tracking-[0.015em] text-foreground sm:text-[19px]">
              {project.body}
            </p>
          )}
          {active === "challenge" && project.challenge && (
            <p className="max-w-2xl text-[17px] font-light leading-relaxed tracking-[0.015em] text-foreground sm:text-[19px]">
              {project.challenge}
            </p>
          )}
          {active === "solution" && project.solution && (
            <p className="max-w-2xl text-[17px] font-light leading-relaxed tracking-[0.015em] text-foreground sm:text-[19px]">
              {project.solution}
            </p>
          )}
        </div>
      </div>

      {/* Mobile accordion — visible only <md, replaces tabs */}
      <div className="mt-4 md:hidden">
        <Accordion
          type="single"
          collapsible
          defaultValue="desc"
          className="w-full"
        >
          <AccordionItem value="desc" className="border-zinc-200">
            <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
              Overview
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <p className="text-[15px] font-light leading-relaxed tracking-[0.01em] text-foreground">
                {project.body}
              </p>
            </AccordionContent>
          </AccordionItem>
          {hasChallenge && (
            <AccordionItem value="challenge" className="border-zinc-200">
              <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
                Challenge
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <p className="text-[15px] font-light leading-relaxed tracking-[0.01em] text-foreground">
                  {project.challenge}
                </p>
              </AccordionContent>
            </AccordionItem>
          )}
          {hasSolution && (
            <AccordionItem value="solution" className="border-zinc-200">
              <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
                Solution
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <p className="text-[15px] font-light leading-relaxed tracking-[0.01em] text-foreground">
                  {project.solution}
                </p>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>

      {/* Metrics + button — 2-col on phones (no overlap), 3-col on md+ */}
      <div className="mt-6 md:mt-auto md:pt-6">
        <div className="grid grid-cols-2 items-end gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-6 md:grid-cols-3 md:gap-x-6 md:gap-y-6 sm:gap-x-8 sm:gap-y-8">
          {project.metrics &&
            project.metrics.slice(0, 5).map((m, idx) => (
              <div key={idx} className="flex flex-col">
                <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-2xl md:sm:text-3xl">
                  {m.value}
                </p>
                <p className="mt-1 whitespace-pre-line text-[11px] leading-tight text-muted-foreground sm:text-xs md:text-xs md:sm:text-sm">
                  {m.label}
                </p>
              </div>
            ))}
          {project.href ? (
            <div className="col-span-2 flex items-end md:col-span-1">
              <Button
                asChild
                className="h-10 w-full justify-center rounded-full bg-[#4e6cb8] px-5 text-sm font-semibold text-white shadow-md shadow-[#4e6cb8]/20 hover:bg-[#4e6cb8]/90 border-0 md:w-fit"
              >
                <Link
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit project
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function toProjectLayoutCard(
  project: ProjectWithSrc,
  className?: string,
): LayoutGridCard {
  const Icon = ICON_MAP[project.slug] ?? Briefcase;
  return {
    id: project.slug,
    className,
    thumbnail: project.src,
    alt: project.name,
    gallery: project.gallery,
    shotLabels: project.shotLabels,
    href: project.href,
    overlay: (
      <>
        <Icon className="size-10 text-white sm:size-12" strokeWidth={2} />
        <p className="mt-2 text-2xl font-medium tracking-tight text-white sm:text-3xl">
          {project.name}
        </p>
        <p className="mt-1 text-xs font-medium tracking-wide text-white/70 uppercase">
          {project.client}
        </p>
      </>
    ),
    content: <DialogLeft project={project} Icon={Icon} />,
  };
}

export function ProjectsGrid({ projects }: { projects: ProjectWithSrc[] }) {
  // chunk into groups of 3 → alternating tall position per row group
  const chunks: ProjectWithSrc[][] = [];
  for (let i = 0; i < projects.length; i += 3) {
    chunks.push(projects.slice(i, i + 3));
  }

  return (
    <section
      id="work"
      className="relative flex w-full max-w-full scroll-mt-[60px] flex-col items-center justify-center overflow-x-clip bg-background py-16 sm:py-20 md:scroll-mt-[72px]"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 sm:gap-10 sm:px-5 xl:max-w-[88rem]">
        <h2 className="mx-auto max-w-4xl text-center text-3xl font-bold leading-[1.1] tracking-tight text-foreground text-balance sm:text-4xl">
          Case{" "}
          <AuroraText colors={AURORA_COLORS} speed={1}>
            Studies
          </AuroraText>
        </h2>

        <div className="flex w-full flex-col gap-4 sm:gap-6">
          {chunks.map((chunk, chunkIdx) => {
            const isTallRight = chunkIdx % 2 === 0; // 0:tall right (inverse), 1:tall left, 2:tall right...
            let cards: LayoutGridCard[];
            if (chunk.length === 3) {
              if (isTallRight) {
                // inverse of HowWeWork: 2 small stacked left, 1 tall right — bento only on lg+, single-col stack below
                const [a, b, c] = chunk;
                cards = [
                  toProjectLayoutCard(a, undefined),
                  toProjectLayoutCard(c, "lg:row-span-2 lg:col-start-2 lg:row-start-1"),
                  toProjectLayoutCard(b, undefined),
                ];
              } else {
                // classic: 1 tall left, 2 stacked right — bento only on lg+
                const [a, b, c] = chunk;
                cards = [
                  toProjectLayoutCard(a, "lg:row-span-2"),
                  toProjectLayoutCard(b, undefined),
                  toProjectLayoutCard(c, undefined),
                ];
              }
            } else {
              cards = chunk.map((p) => toProjectLayoutCard(p, undefined));
            }

            return (
              <div
                key={chunkIdx}
                className={cn(
                  "flex h-auto min-h-0 w-full flex-col items-center lg:h-[72svh] lg:min-h-0",
                )}
              >
                <LayoutGrid variant="split" mobileScrollTarget={false} cards={cards} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
