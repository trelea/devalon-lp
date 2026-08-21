import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"

import { ArrowUpRight, Mail, Phone, Star } from "lucide-react"

import { ContactForm } from "@/components/contact-form"
import { AnimationGate } from "@/components/ui/animation-gate"
import { AvatarCircles } from "@/components/ui/avatar-circles"
import { DotPattern } from "@/components/ui/dot-pattern"
import { GridPattern } from "@/components/ui/grid-pattern"
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern"
import { Meteors } from "@/components/ui/meteors"
import { Button as MovingBorderButton } from "@/components/ui/moving-border"
import { WobbleCard } from "@/components/ui/wobble-card"
import { cn } from "@/lib/utils"

type Shot = {
  src: string
  label: string
  position?: string
}

type Work = {
  num: string
  client: string
  name: string
  href?: string
  /** folder under public/works/ holding this project's media */
  slug?: string
  /** labels for the folder's media, matched by sorted file order */
  shotLabels?: string[]
  /** object-position class per image (defaults to object-top) */
  shotPositions?: string[]
  /** col-span class per image, overriding the automatic pattern (12-col grid) */
  shotSpans?: string[]
  body: string
  /** outcome bullets rendered under the summary; "Lead-in: rest" gets a bold lead-in */
  highlights?: string[]
}

const works: Work[] = [
  {
    num: "01",
    slug: "2marketing",
    shotLabels: ["Landing page", "Mobile app", "Admin dashboard"],
    client: "AI SaaS · Denmark",
    name: "2Marketing",
    href: "https://2marketing.ai",
    body: "A multi-network SaaS platform that automates campaign creation, social scheduling, and AI features across Google Ads, Meta, LinkedIn, and Reddit from a unified backend.",
    highlights: [
      "Built for scale: Reliably processes 100,000+ automated posts and ad updates monthly with automated error recovery.",
      "Saves 15+ hours weekly per business by replacing manual ad management with streamlined 1-click publishing.",
    ],
  },
  {
    num: "02",
    slug: "wynne",
    shotLabels: ["Home manager app", "Admin dashboard", "Client dashboard"],
    shotPositions: ["object-right", "object-left"],
    shotSpans: ["col-span-6", "col-span-6", "col-span-12"],
    client: "Web app · USA",
    name: "Wynne Home Manager",
    href: "https://app.wynnehomemanager.com/",
    body: "A full-stack property management progressive web app designed for daily multi-device tracking and maintenance management.",
    highlights: [
      "Engineered the entire backend from scratch: secure REST APIs, database schema, migration pipelines, and developer tooling.",
      "Delivers a seamless app-like mobile experience with zero installation friction across all modern devices.",
    ],
  },
  {
    num: "03",
    slug: "megawind",
    shotLabels: [
      "MorePower — one of the 7 brands",
      "Importex-Trans — another brand",
      "News & contact",
      "Solar news & call-to-action",
    ],
    client: "Energy · 7 brands",
    name: "Bundller — one system, many brands",
    href: "https://www.megawind.md",
    shotSpans: ["col-span-6", "col-span-6", "col-span-6", "col-span-6"],
    body: "A multi-tenant web ecosystem powering seven distinct solar energy and battery brands from a single centralized management architecture.",
    highlights: [
      "Powered high-speed, multi-lingual landing pages that helped partner companies apply for and secure competitive EU grants.",
      "Custom CMS empowers each company to manage its own localized content, products, and news independently.",
    ],
  },
  {
    num: "04",
    slug: "dialogimobil",
    shotLabels: ["Listings platform", "Mobile property page", "Admin login"],
    shotPositions: ["object-top", "object-top", "object-center"],
    client: "Real estate · Chișinău",
    name: "Dialog Imobil",
    href: "https://dialogimobil.md",
    body: "A comprehensive tri-lingual real estate catalogue and lead generation portal for properties, land, and mortgage guidance in Chișinău.",
    highlights: [
      "Built a custom back-office dashboard allowing agents to update properties, hot offers, and articles in real time without technical help.",
      "Streamlined buyer navigation with interactive maps, filterable property categories, and direct contact forms.",
    ],
  },
  {
    num: "05",
    slug: "premierinvest",
    shotLabels: ["Listings platform", "Property page", "Mobile search"],
    shotPositions: ["object-top", "object-top", "object-center"],
    shotSpans: ["col-span-12", "col-span-8", "col-span-4"],
    client: "Real estate · Chișinău",
    name: "Premier Invest",
    href: "https://primeinvest.md",
    body: "A modern real estate marketplace showcasing verified property deals, developer offers, and rental listings across Chișinău.",
    highlights: [
      "Replaced fragmented client communication with a high-trust digital catalogue featuring dynamic search and saved favorites.",
      "Integrated an internal CMS allowing the agency owner to manage all listing media and price updates independently.",
    ],
  },
  {
    num: "06",
    slug: "dialoginvest",
    shotLabels: ["Investor landing", "Key advantages", "Mobile offers"],
    shotPositions: ["object-top", "object-top", "object-center"],
    shotSpans: ["col-span-12", "col-span-8", "col-span-4"],
    client: "Investments · Romania",
    name: "DialogInvest",
    href: "https://dialoginvest.md",
    body: "A high-converting investor relations platform designed to build immediate trust for commercial real estate and business deals in Romania.",
    highlights: [
      "Converts complex yield modeling, verified deal structures, and legal protections into clear, authoritative presentation pages.",
      "Consistently generates serious investor inquiries by replacing aggressive sales pitches with verified financial transparency.",
    ],
  },
  {
    num: "07",
    slug: "etatruck",
    shotLabels: ["Corporate site", "Fleet gallery", "Mobile — EU network"],
    shotPositions: ["object-top", "object-top", "object-center"],
    shotSpans: ["col-span-12", "col-span-8", "col-span-4"],
    client: "Logistics · EU",
    name: "ETA Truck",
    href: "https://eta-truck.ro",
    body: "A corporate digital platform for an international Bucharest logistics firm specializing in oversized cargo, permits, and EU transport networks.",
    highlights: [
      "Features real-time job openings, fleet showcases, and service breakdowns to establish immediate logistical credibility.",
      "Includes a standalone admin panel so non-technical staff can update fleet galleries and company news effortlessly.",
    ],
  },
  {
    num: "08",
    slug: "redcore",
    shotLabels: ["Lead-gen site", "CMS — project media", "Mobile — service pages"],
    shotPositions: ["object-top", "object-top", "object-top"],
    shotSpans: ["col-span-12", "col-span-9", "col-span-3"],
    client: "Local business · USA",
    name: "Red Core Concrete",
    href: "https://redcoreconcrete.com",
    body: "A high-converting web platform and project gallery built for a specialized concrete and controlled demolition contractor in New England.",
    highlights: [
      "Converts organic traffic into quote inquiries by giving each core service dedicated landing pages and visual proof galleries.",
      "Integrated a custom media CMS enabling the owner to upload project photos and job logs directly from the field.",
    ],
  },
  {
    num: "09",
    slug: "palazzo",
    shotLabels: ["Clinic site", "Mobile booking", "Online appointments"],
    shotPositions: ["object-top", "object-center", "object-center"],
    client: "Wellness · Chișinău",
    name: "Palazzo Aesthetics",
    href: "https://palazzoaesthetics.md/",
    body: "An elegant, multi-lingual digital storefront and online appointment portal for a specialized physiotherapy and phytotherapy clinic in Chișinău.",
    highlights: [
      "Streamlined patient onboarding with a friction-free booking flow across three languages.",
      "Backed by a bespoke CMS for managing medical services, news updates, and appointment schedules without developer intervention.",
    ],
  },
]

function PlaceholderFrame({
  name,
  meteors = false,
}: {
  name: string
  meteors?: boolean
}) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-secondary/40">
      <GridPattern
        width={36}
        height={36}
        className="fill-none stroke-foreground/[0.06] [mask-image:radial-gradient(400px_circle_at_50%_50%,white,transparent)]"
      />
      {meteors && <Meteors number={16} className="bg-primary/70" />}
      <span className="relative text-2xl font-semibold tracking-tight text-foreground/15 sm:text-3xl">
        {name}
      </span>
    </div>
  )
}

function SlideBackdrop({ flipped }: { flipped: boolean }) {
  return (
    <AnimationGate className="absolute inset-0">
      {/* pre-faded gradient, not blur-3xl: animating a blurred layer re-runs
          the Gaussian blur every frame in Firefox */}
      <div
        aria-hidden
        className={`pointer-events-none absolute top-[calc(25%-3rem)] size-[30rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-primary)_12%,transparent),transparent)] animate-glow-drift ${
          flipped ? "-right-36" : "-left-36"
        }`}
      />
      <InteractiveGridPattern
        width={48}
        height={48}
        squares={[24, 18]}
        squaresClassName="hover:fill-primary/25"
        className={
          flipped
            ? "[mask-image:radial-gradient(620px_circle_at_70%_45%,white,transparent)]"
            : "[mask-image:radial-gradient(620px_circle_at_30%_45%,white,transparent)]"
        }
      />
    </AnimationGate>
  )
}

function EdgeFade({ flipped }: { flipped: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 z-10 hidden w-14 md:block lg:w-20 ${
        flipped
          ? "right-0 bg-gradient-to-l from-background via-background/55 via-35% to-transparent"
          : "left-0 bg-gradient-to-r from-background via-background/55 via-35% to-transparent"
      }`}
    />
  )
}

// each project's media lives in public/works/<slug>/ — whatever images are in
// the folder get shown, in filename order, labelled by shotLabels position
function availableShots(work: Work): Shot[] {
  if (!work.slug) return []
  const dir = join(process.cwd(), "public", "works", work.slug)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((file) => /\.(webp|avif|png|jpe?g)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file, index) => ({
      src: `/works/${work.slug}/${file}`,
      label: work.shotLabels?.[index] ?? work.name,
      position: work.shotPositions?.[index],
    }))
}

// varied 3-image arrangements on a 6-col grid, picked per project so the
// galleries don't all look the same: wide+narrow / narrow+wide, full-width
// image on top or bottom
const gridPatterns = [
  ["col-span-8", "col-span-4", "col-span-12"],
  ["col-span-4", "col-span-8", "col-span-12"],
  ["col-span-12", "col-span-8", "col-span-4"],
  ["col-span-12", "col-span-4", "col-span-8"],
]

function shotSpan(count: number, index: number, workIndex: number) {
  if (count === 1 || count === 2) return "col-span-12"
  if (count === 3) return gridPatterns[workIndex % gridPatterns.length][index]
  // 4+: wide/narrow pairs that swap sides each row, odd leftover gets a full row
  if (count % 2 === 1 && index === count - 1) return "col-span-12"
  const wideFirst = Math.floor(index / 2) % 2 === 0
  return wideFirst === (index % 2 === 0) ? "col-span-8" : "col-span-4"
}

function WorkGallery({
  work,
  shots,
  workIndex,
}: {
  work: Work
  shots: Shot[]
  workIndex: number
}) {
  if (!shots.length) return <PlaceholderFrame name={work.name} />
  return (
    <div className="absolute inset-0 grid auto-rows-fr grid-cols-12 gap-2 p-4 md:gap-3 md:p-[10%]">
      {shots.map((shot, index) => (
        <WobbleCard
          key={shot.src}
          noise={false}
          containerClassName={cn(
            "min-h-0 bg-secondary/40 shadow-[0_10px_22px_-10px] shadow-primary/30",
            work.shotSpans?.[index] ?? shotSpan(shots.length, index, workIndex)
          )}
          className="p-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shot.src}
            alt={`${work.name} — ${shot.label}`}
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              shot.position ?? "object-top"
            )}
          />
        </WobbleCard>
      ))}
    </div>
  )
}

function WorkSlide({ work, index }: { work: Work; index: number }) {
  const flipped = index % 2 === 1
  const shots = availableShots(work)
  return (
    <article className="grid md:min-h-svh md:grid-cols-2">
      <div
        className={`relative flex items-center overflow-hidden px-6 py-16 sm:px-8 md:py-24 lg:px-16 ${
          flipped ? "md:order-2" : ""
        }`}
      >
        <SlideBackdrop flipped={flipped} />
        <div className="relative z-10 w-full max-w-xl md:mx-auto">
          <p className="text-sm font-medium text-muted-foreground">
            {work.client}
          </p>
          <h3 className="mt-3 w-fit bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text pb-1 text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
            {work.name}
          </h3>
          <div className="mt-5 h-px w-16 bg-border" />
          <p className="mt-5 max-w-xl text-xl leading-relaxed text-muted-foreground">
            {work.body}
          </p>
          {work.highlights && (
            <ul className="mt-4 max-w-xl space-y-2.5">
              {work.highlights.map((highlight) => {
                const colon = highlight.indexOf(": ")
                const lead = colon > 0 ? highlight.slice(0, colon) : null
                const rest = colon > 0 ? highlight.slice(colon + 2) : highlight
                return (
                  <li
                    key={highlight}
                    className="flex gap-3 text-base leading-relaxed text-muted-foreground sm:text-lg"
                  >
                    <span
                      aria-hidden
                      className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary"
                    />
                    <span>
                      {lead && (
                        <span className="font-medium text-foreground/90">
                          {lead}:{" "}
                        </span>
                      )}
                      {rest}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
          {work.href && (
            <MovingBorderButton
              as="a"
              href={work.href}
              target="_blank"
              rel="noopener noreferrer"
              borderRadius="0.5rem"
              duration={4000}
              containerClassName="group mt-7 inline-block h-12 w-44 text-base"
              borderClassName="bg-[radial-gradient(#2563eb_40%,transparent_60%)]"
              className="relative overflow-hidden border-border bg-card font-semibold text-foreground transition-colors duration-300 group-hover:text-primary-foreground"
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-300 ease-out group-hover:translate-x-0"
              />
              <span className="relative z-10 flex items-center gap-1.5">
                Visit site
                <ArrowUpRight className="size-4" strokeWidth={1.75} />
              </span>
            </MovingBorderButton>
          )}
        </div>
      </div>
      <div
        className={cn(
          "relative h-72 sm:h-96 md:h-auto",
          shots.length > 1 && "h-[30rem] sm:h-[34rem]",
          flipped && "md:order-1"
        )}
      >
        <WorkGallery work={work} shots={shots} workIndex={index} />
        <EdgeFade flipped={flipped} />
      </div>
    </article>
  )
}

// the same clients and people as the recommendations section; each links to
// their live site
const ctaAvatars = [
  {
    imageUrl: "/recommendations/2marketing.jpg",
    profileUrl: "https://2marketing.ai",
    name: "2Marketing.ai",
  },
  {
    imageUrl: "/recommendations/thomas-bach-petersen.jpg",
    profileUrl: "https://2ai.dk",
    name: "Thomas Bach Petersen — 2ai",
  },
  {
    imageUrl: "/recommendations/dimitry-bizga.jpg",
    profileUrl: "https://synthax.codes",
    name: "Dimitry Bizga — Synthax Codes",
  },
  {
    imageUrl: "/recommendations/vasile-borogan.jpg",
    profileUrl: "https://primeinvest.md",
    name: "Vasile Borogan — Premier Invest",
  },
  {
    imageUrl: "/recommendations/redcore.jpg",
    profileUrl: "https://redcoreconcrete.com",
    name: "Red Core Concrete",
  },
  {
    imageUrl: "/recommendations/palazzo-aesthetics.svg",
    profileUrl: "https://palazzoaesthetics.md/",
    name: "Palazzo Aesthetics",
    // logo is dark green on a transparent background
    className: "bg-[#f2eee4]",
  },
  {
    imageUrl: "/recommendations/inesa-dita.webp",
    profileUrl: "https://www.compass.com/agents/inesa-dita/",
    name: "Inesa Dita — Real Estate Agent",
  },
]

function CtaSlide({ flipped }: { flipped: boolean }) {
  return (
    <article className="grid md:min-h-svh md:grid-cols-2">
      <div
        className={`relative flex items-center overflow-hidden px-6 py-16 sm:px-8 md:py-24 lg:px-16 ${
          flipped ? "md:order-2" : ""
        }`}
      >
        <SlideBackdrop flipped={flipped} />
        <div className="relative z-10 w-full max-w-xl md:mx-auto">
          <p className="text-sm font-medium text-muted-foreground">You?</p>
          <h3 className="mt-3 w-fit bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text pb-1 text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
            Your project
          </h3>
          <div className="mt-5 h-px w-16 bg-border" />
          <p className="mt-5 max-w-xl text-xl leading-relaxed text-muted-foreground">
            This spot is reserved for the idea you haven&apos;t sent us yet —
            good, bad, or delusional. Tell us what you want to build and
            we&apos;ll tell you honestly what it takes.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <AvatarCircles
              avatarUrls={ctaAvatars}
              className="-space-x-4"
              avatarClassName="size-12"
            />
            <div className="flex items-center gap-1" aria-label="Rated 5 out of 5 by our clients">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-5 fill-amber-400 text-amber-400"
                  strokeWidth={0}
                  aria-hidden
                />
              ))}
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Trusted by clients across four countries
          </p>
          <div className="mt-7 space-y-3">
            <a
              href="mailto:hello@devalon.dev"
              className="flex w-fit items-center gap-2.5 text-base text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="size-4 text-primary" strokeWidth={1.75} aria-hidden />
              hello@devalon.dev
            </a>
            <a
              href="tel:+37367500054"
              className="flex w-fit items-center gap-2.5 text-base text-muted-foreground transition-colors hover:text-foreground"
            >
              <Phone className="size-4 text-primary" strokeWidth={1.75} aria-hidden />
              +373 675 00 054
            </a>
          </div>
        </div>
      </div>
      <div
        id="contact"
        className={`relative flex scroll-mt-20 items-center justify-center overflow-hidden px-6 py-12 sm:px-10 md:py-24 lg:px-14 ${
          flipped ? "md:order-1" : ""
        }`}
      >
        <DotPattern
          width={22}
          height={22}
          className="fill-foreground/[0.04] [mask-image:radial-gradient(420px_circle_at_60%_40%,white,transparent)]"
        />
        <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">
            Tell us your idea
          </h3>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            Share a few details about your project and we&apos;ll get back to
            you with an honest assessment — typically within one business day.
          </p>
          <ContactForm className="mt-6" />
        </div>
      </div>
    </article>
  )
}

export function Works() {
  return (
    <section
      id="work"
      className="relative isolate overflow-hidden border-b border-border"
    >
      <GridPattern
        width={36}
        height={36}
        className="-z-10 fill-none stroke-foreground/[0.04] [mask-image:radial-gradient(700px_circle_at_25%_15%,white,transparent)]"
      />
      <div className="mx-auto w-full max-w-7xl px-6 pt-20 sm:px-8 sm:pt-24 xl:max-w-[88rem]">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Works &amp; projects
        </h2>
        <p className="mt-3 max-w-xl text-xl leading-relaxed text-muted-foreground">
          Real projects, live on the internet — from Denmark to the USA to
          Moldova and Romania, in five languages. Click through and see for
          yourself; we&apos;ll gladly tell you the story behind any of them.
        </p>
      </div>
      <div className="mt-12 sm:mt-16">
        {works.map((work, index) => (
          <WorkSlide key={work.num} work={work} index={index} />
        ))}
        <CtaSlide flipped={works.length % 2 === 1} />
      </div>
    </section>
  )
}
