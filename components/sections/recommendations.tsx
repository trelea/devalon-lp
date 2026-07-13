import Image from "next/image"
import { Building2 } from "lucide-react"

import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { AnimationGate } from "@/components/ui/animation-gate"
import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"

// TODO: Thomas (2ai), 2Marketing.ai and Palazzo Aesthetics still need their
// real quote texts.
// - `name` is the customer: a company name or a real human name
// - `role` goes under it: the person's role, or the company's theme/industry
// - kind: "person"  → round initials avatar (or photo via `avatar`)
// - kind: "company" → round logo tile (via `avatar`) or building icon
// `avatar` is an optional image path in /public.
// `avatarClassName` overrides the tile background for logos that need it.
type Recommendation = {
  kind: "person" | "company"
  name: string
  role: string
  quote: string
  avatar?: string
  avatarClassName?: string
}

const recommendations: Recommendation[] = [
  {
    kind: "person",
    name: "Dimitry Bizga",
    role: "Founder @ Synthax Codes",
    quote:
      "Having worked closely with Marius on multiple projects in the same group, I can confidently say he is an outstanding Software Engineer. He took full ownership of our core backend systems, built stable architectures from scratch, and resolved complex infrastructure bottlenecks with great efficiency. Marius stands out because he delivers exactly what the project requires, turning complex requirements into rock-solid, durable, and highly optimized software that runs flawlessly in production.",
    avatar: "/recommendations/dimitry-bizga.jpg",
  },
  {
    kind: "company",
    name: "Red Core Concrete",
    role: "Concrete contractor · New England, USA",
    quote:
      "I've worked with Marius Trelea on multiple projects, and every experience has been excellent. He built our company website exactly the way we wanted and was always responsive, professional, and easy to communicate with throughout the process. Everything was completed on time, and the final result exceeded our expectations.",
    avatar: "/recommendations/redcore.jpg",
  },
  {
    kind: "person",
    name: "Thomas Bach Petersen",
    role: "Co-Founder & CTO @ 2ai",
    quote: "Placeholder — Thomas's recommendation text coming soon.",
    avatar: "/recommendations/thomas-bach-petersen.jpg",
  },
  {
    kind: "company",
    name: "2Marketing.ai",
    role: "Marketing & AI SaaS · Denmark",
    quote: "Placeholder — 2Marketing's recommendation text coming soon.",
    avatar: "/recommendations/2marketing.jpg",
  },
  {
    kind: "person",
    name: "Vasile Borogan",
    role: "CEO @ Premier Estate",
    quote:
      "I highly recommend Marius as a Software Engineer. We collaborated on our internal applications, and he successfully managed both front-end and back-end aspects, handling all engineering challenges with great efficiency. What makes Marius stand out is his strong technical expertise combined with a client-first mindset—he has a remarkable ability to understand exactly what the client wants and translate it into rock-solid, durable, and highly optimized software.",
    avatar: "/recommendations/vasile-borogan.jpg",
  },
  {
    kind: "company",
    name: "Palazzo Aesthetics",
    role: "Phytoaesthetics & phytotherapy clinic · Chișinău, Moldova",
    quote: "Placeholder — Palazzo Aesthetics' recommendation text coming soon.",
    avatar: "/recommendations/palazzo-aesthetics.svg",
    // logo is dark green on a transparent background
    avatarClassName: "bg-[#f2eee4]",
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

function RecommendationCard({
  kind,
  name,
  role,
  quote,
  avatar,
  avatarClassName,
}: Recommendation) {
  return (
    <figure className="dark relative isolate flex flex-col overflow-hidden rounded-2xl border border-border bg-[linear-gradient(115deg,oklch(0.22_0.014_258),oklch(0.25_0.05_262),oklch(0.22_0.014_258))] bg-[length:200%_200%] p-3.5 text-foreground transition-colors [--duration:18s] motion-safe:animate-shine hover:border-primary/40 sm:p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_120%_at_80%_0%,rgba(113,150,224,0.10),transparent)]"
      />
      <figcaption className="flex items-center gap-2.5 sm:gap-3">
        <span
          className={cn(
            kind === "company"
              ? "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary text-primary sm:size-11"
              : "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs font-semibold text-primary sm:size-11 sm:text-sm",
            avatarClassName
          )}
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
          <span className="block text-sm font-semibold text-foreground sm:text-[15px]">
            {name}
          </span>
          <span className="block text-xs text-muted-foreground sm:text-[13px]">
            {role}
          </span>
        </span>
      </figcaption>
      <blockquote className="mt-3 text-[13px] leading-snug text-foreground/85 sm:mt-4 sm:text-base sm:leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>
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
        numSquares={20}
        maxOpacity={0.12}
        duration={3}
        repeatDelay={0.6}
        className="absolute inset-0 -z-10 h-full w-full fill-primary/25 stroke-foreground/[0.06] [mask-image:radial-gradient(1000px_circle_at_50%_35%,white,transparent)]"
      />
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:py-16 xl:max-w-[88rem]">
        <div className="max-w-2xl text-left sm:mx-auto sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            People we&apos;ve built with
          </h2>
        </div>

        <AnimationGate
          className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, rgba(0,0,0,0.35) 3%, rgba(0,0,0,0.75) 6%, black 10%, black 90%, rgba(0,0,0,0.75) 94%, rgba(0,0,0,0.35) 97%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, rgba(0,0,0,0.35) 3%, rgba(0,0,0,0.75) 6%, black 10%, black 90%, rgba(0,0,0,0.75) 94%, rgba(0,0,0,0.35) 97%, transparent)",
          }}
        >
          {columns.map((column, index) => (
            <Marquee
              key={index}
              vertical
              pauseOnHover
              repeat={3}
              reverse={column.reverse}
              className={
                index === 0
                  ? "h-[calc(100svh-11rem)] min-h-[26rem] p-0 sm:h-[min(50rem,calc(100svh-14rem))] sm:min-h-0"
                  : index === 1
                    ? "hidden h-[calc(100svh-11rem)] min-h-[26rem] p-0 sm:flex sm:h-[min(50rem,calc(100svh-14rem))] sm:min-h-0"
                    : "hidden h-[calc(100svh-11rem)] min-h-[26rem] p-0 sm:h-[min(50rem,calc(100svh-14rem))] sm:min-h-0 lg:flex"
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
        </AnimationGate>
      </div>
    </section>
  )
}
