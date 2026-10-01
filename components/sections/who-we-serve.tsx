"use client";

import { Compass, Cpu, Rocket, type LucideIcon } from "lucide-react";

import { AuroraText } from "@/components/ui/aurora-text";
import { LayoutGrid, type LayoutGridCard } from "@/components/ui/layout-grid";

const AURORA_COLORS = ["#3B4354", "#4e6cb8", "#7196E0", "#5b7fd4"];

type WorkCard = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  className?: string;
};

const cards: WorkCard[] = [
  {
    id: "discover-design",
    icon: Compass,
    title: "Discover & Design",
    description:
      "We start by understanding your problem, users, and constraints — then shape requirements, prototypes, and technical architecture fast. AI accelerates research, specs, and wireframes, so you see a concrete direction in days, not months.",
    tags: [
      "Business Analysis",
      "Prototyping",
      "Solution Architecture",
      "AI Consulting",
    ],
    thumbnail: "/how-we-work/dedicated-teams.jpg",
    className: "lg:row-span-2",
  },
  {
    id: "build-integrate",
    icon: Cpu,
    title: "Build & Integrate",
    description:
      "Senior engineers ship your product with AI-accelerated development: assisted code, reviews, and tests inside real CI/CD pipelines. LLM features, automations, and integrations land as production systems — not demos.",
    tags: ["Custom Development", "API Integration", "QA & Testing", "DevOps"],
    thumbnail: "/how-we-work/custom-delivery.jpg",
  },
  {
    id: "deploy-evolve",
    icon: Rocket,
    title: "Deploy, Measure & Evolve",
    description:
      "We ship to the cloud with monitoring, evals, and observability from day one — then keep iterating on real usage data. Your software improves every cycle instead of decaying after launch.",
    tags: [
      "Cloud Hosting",
      "Monitoring",
      "Support & Maintenance",
      "Optimization",
    ],
    thumbnail: "/how-we-work/team-augmentation.jpg",
  },
];

function toLayoutGridCard(card: WorkCard): LayoutGridCard {
  const Icon = card.icon;
  return {
    id: card.id,
    className: card.className,
    thumbnail: card.thumbnail,
    alt: card.title,
    overlay: (
      <>
        <Icon className="size-10 text-white sm:size-12" strokeWidth={2} />
        <p className="mt-2 text-2xl font-medium tracking-tight text-white sm:text-3xl">
          {card.title}
        </p>
        <p className="mt-1 text-xs font-medium tracking-wide text-white/60 uppercase">
          Click to expand
        </p>
      </>
    ),
    content: (
      <div>
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-5">
          <Icon
            className="size-7 shrink-0 text-[#4e6cb8] sm:size-11 lg:size-14"
            strokeWidth={2}
          />
          <h3 className="text-xl font-medium tracking-tight sm:text-3xl lg:text-4xl">
            <AuroraText colors={AURORA_COLORS} speed={1}>
              {card.title}
            </AuroraText>
          </h3>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed font-normal text-foreground/80 sm:mt-6 sm:text-lg lg:mt-8 lg:text-xl">
          {card.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-6 sm:gap-2">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-[11px] font-medium text-foreground/85 sm:px-3.5 sm:py-1.5 sm:text-xs lg:text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
  };
}

export function HowWeWork() {
  return (
    <section
      id="how-we-work"
      className="relative flex min-h-svh min-h-dvh w-full max-w-full scroll-mt-[72px] flex-col items-center justify-center overflow-x-clip bg-transparent lg:h-[calc(100svh-5rem)] lg:h-[calc(100dvh-5rem)] lg:min-h-0"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-6 px-4 sm:gap-8 sm:px-5 lg:min-h-0 lg:gap-8 xl:max-w-[88rem] xl:gap-10">
        <h2 className="mx-auto max-w-4xl text-center text-3xl font-bold leading-[1.1] tracking-tight text-foreground text-balance sm:text-4xl">
          How We Work{" "}
          <AuroraText colors={AURORA_COLORS} speed={1}>
            With You
          </AuroraText>
        </h2>

        <div className="flex h-auto min-h-0 w-full flex-col items-center sm:h-auto md:h-[78svh] md:h-[78dvh] md:min-h-[30rem] lg:h-[72svh] lg:h-[72dvh] lg:min-h-0">
          <LayoutGrid
            variant="split"
            splitMobile="equal"
            mobileScrollTarget={false}
            cards={cards.map(toLayoutGridCard)}
          />
        </div>
      </div>
    </section>
  );
}
