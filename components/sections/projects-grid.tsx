"use client";

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
import { LayoutGrid, type LayoutGridCard } from "@/components/ui/layout-grid";
import { cn } from "@/lib/utils";

const AURORA_COLORS = ["#3B4354", "#4e6cb8", "#7196E0", "#5b7fd4"];

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

// Homepage bento cards are plain links to the server-rendered case study
// pages — no modal. Full text lives only on /work/[slug].
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
    hrefInternal: `/work/${project.slug}`,
    content: null,
    overlay: (
      <>
        <Icon className="size-10 text-white sm:size-12" strokeWidth={2} />
        <p className="mt-2 text-2xl font-medium tracking-tight text-white sm:text-3xl">
          {project.name}
        </p>
        <p className="mt-1 text-xs font-medium tracking-wide text-white/70 uppercase">
          {project.client}
        </p>
        <p className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-white/85">
          Read case study
          <ArrowUpRight className="size-4" aria-hidden />
        </p>
      </>
    ),
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
                  "flex h-auto min-h-0 w-full flex-col items-center lg:h-[72svh] lg:h-[72dvh] lg:min-h-0",
                )}
              >
                <LayoutGrid
                  variant="split"
                  enableExpand={false}
                  mobileScrollTarget={false}
                  cards={cards}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
