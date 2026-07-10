import Image from "next/image"
import { Building2 } from "lucide-react"

import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { Marquee } from "@/components/ui/marquee"

// TODO: replace with real recommendations from actual people AND companies.
// - kind: "person"  → round initials avatar (or photo via `avatar`)
// - kind: "company" → square logo tile (via `avatar`) or building icon
// `avatar` is an optional image path in /public.
type Recommendation = {
  kind: "person" | "company"
  name: string
  role: string
  quote: string
  avatar?: string
}

const recommendations: Recommendation[] = [
  {
    kind: "person",
    name: "Full Name",
    role: "CTO @ Company One",
    quote:
      "Placeholder — a couple of sentences about working with Devalon and what got built.",
  },
  {
    kind: "company",
    name: "Company One",
    role: "Software partner",
    quote:
      "Placeholder — the company's official recommendation of Devalon as a development partner.",
  },
  {
    kind: "person",
    name: "Another Name",
    role: "Founder @ Startup Two",
    quote:
      "Placeholder — how Devalon helped take the idea from a rough sketch to a shipped product.",
  },
  {
    kind: "company",
    name: "Enterprise Three",
    role: "Long-term client",
    quote:
      "Placeholder — what the company hired Devalon for and what got delivered.",
  },
  {
    kind: "person",
    name: "Fifth Person",
    role: "Engineer @ Team Five",
    quote:
      "Placeholder — a colleague's perspective on working together on a hard project.",
  },
  {
    kind: "company",
    name: "Small Business Six",
    role: "Client since 2024",
    quote: "Placeholder — a small-client story: idea in, working software out.",
  },
]

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function RecommendationCard({ kind, name, role, quote, avatar }: Recommendation) {
  return (
    <figure className="dark relative isolate flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-[linear-gradient(115deg,oklch(0.22_0.014_258),oklch(0.25_0.05_262),oklch(0.22_0.014_258))] bg-[length:200%_200%] p-4 text-foreground transition-colors [--duration:18s] motion-safe:animate-shine hover:border-primary/40 sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_120%_at_80%_0%,rgba(113,150,224,0.10),transparent)]"
      />
      <blockquote className="text-sm leading-snug text-foreground/85 sm:text-lg sm:leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3 sm:mt-6 sm:gap-3.5">
        <span
          className={
            kind === "company"
              ? "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary text-primary sm:size-13"
              : "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs font-semibold text-primary sm:size-13 sm:text-base"
          }
        >
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={52}
              height={52}
              className="size-full object-cover"
            />
          ) : kind === "company" ? (
            <Building2 className="size-4.5 sm:size-6" strokeWidth={1.5} />
          ) : (
            initials(name)
          )}
        </span>
        <span className="leading-snug">
          <span className="block text-sm font-semibold text-foreground sm:text-base">
            {name}
          </span>
          <span className="block text-[13px] text-muted-foreground sm:text-[15px]">
            {role}
          </span>
        </span>
      </figcaption>
    </figure>
  )
}

const columns = [
  { items: recommendations.slice(0, 2), duration: "45s", reverse: false },
  { items: recommendations.slice(2, 4), duration: "60s", reverse: true },
  { items: recommendations.slice(4, 6), duration: "50s", reverse: false },
]

export function Recommendations() {
  return (
    <section
      id="recommendations"
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden border-b border-border bg-card/40"
    >
      <AnimatedGridPattern
        numSquares={40}
        maxOpacity={0.12}
        duration={3}
        repeatDelay={0.6}
        className="absolute inset-0 -z-10 h-full w-full fill-primary/25 stroke-foreground/[0.06] [mask-image:radial-gradient(1000px_circle_at_50%_35%,white,transparent)]"
      />
      <div className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 sm:py-24 xl:max-w-[88rem]">
        <div className="max-w-2xl text-left sm:mx-auto sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            People we&apos;ve built with
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Real companies and real humans we&apos;ve worked with over the
            years — in their own words.
          </p>
        </div>

        <div
          className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, rgba(0,0,0,0.18) 5%, rgba(0,0,0,0.55) 11%, black 18%, black 82%, rgba(0,0,0,0.55) 89%, rgba(0,0,0,0.18) 95%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, rgba(0,0,0,0.18) 5%, rgba(0,0,0,0.55) 11%, black 18%, black 82%, rgba(0,0,0,0.55) 89%, rgba(0,0,0,0.18) 95%, transparent)",
          }}
        >
          {columns.map((column, index) => (
            <Marquee
              key={index}
              vertical
              pauseOnHover
              reverse={column.reverse}
              className={
                index === 0
                  ? "h-[calc(100svh-16rem)] min-h-[26rem] p-0 sm:h-[min(42rem,calc(100svh-21rem))] sm:min-h-0"
                  : index === 1
                    ? "hidden h-[calc(100svh-16rem)] min-h-[26rem] p-0 sm:flex sm:h-[min(42rem,calc(100svh-21rem))] sm:min-h-0"
                    : "hidden h-[calc(100svh-16rem)] min-h-[26rem] p-0 sm:h-[min(42rem,calc(100svh-21rem))] sm:min-h-0 lg:flex"
              }
              style={
                {
                  "--duration": column.duration,
                  "--gap": "1.25rem",
                } as React.CSSProperties
              }
            >
              {column.items.map((rec) => (
                <RecommendationCard key={rec.name} {...rec} />
              ))}
            </Marquee>
          ))}
        </div>
      </div>
    </section>
  )
}
