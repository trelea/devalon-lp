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
}

const works: Work[] = [
  {
    num: "01",
    slug: "2marketing",
    shotLabels: ["Landing page", "Mobile app", "Admin dashboard"],
    client: "AI SaaS · Denmark",
    name: "2Marketing",
    href: "https://2marketing.ai",
    body: "2Marketing is a marketing and AI SaaS from Denmark. Small businesses use it to plan and publish their social media and ads on Meta and Google, without hiring an agency. We provided the tech solutions behind it and helped them build out the digital side: the backend services that connect accounts, schedule and publish posts and ads, and pull in statistics, plus the landing page and parts of the admin dashboard.",
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
    body: "Wynne Home Manager is a home-management web app built for a customer in the USA. Its users log in every day to keep track of their properties and maintenance, and it installs on any device like a native app. We architected and built the entire backend: the database and its migrations, the REST APIs, and the architecture behind them, plus the utilities the frontend team needed to do their part.",
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
    body: "We built seven websites for companies selling solar batteries and energy solutions, all running on one system we made for them. Each brand has its own look, content and audience, in Romanian and Russian, and each comes with its own CMS, so every company controls the content on its own pages. The landing pages are very fast, and that mattered beyond sales: our solution helped these companies apply for and win European grants.",
  },
  {
    num: "04",
    slug: "dialogimobil",
    shotLabels: ["Listings platform", "Mobile property page", "Admin login"],
    shotPositions: ["object-top", "object-top", "object-center"],
    client: "Real estate · Chișinău",
    name: "Dialog Imobil",
    href: "https://dialogimobil.md",
    body: "A real-estate platform for an agency in Chișinău. Visitors browse apartments, houses, commercial spaces and land, with prices, maps and hot offers, plus mortgage guidance, six service areas and a market news blog — all in three languages. Behind it, the agency has its own admin panel to manage every listing, offer and article in-house.",
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
    body: "Another listings platform, for a different agency. We helped the owner present his services and real estate to his customers in a more convenient and trustworthy way: a listings website backed by a CMS, so he manages every offer himself. Sale and rent across apartments, houses, commercial spaces and land, with property pages, favourites and the most viewed offers from the city's known developers. It started from zero and is now a working catalogue.",
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
    body: "A landing page whose real job is building trust between DialogInvest and the founders and investors it works with. It explains how investing in Romanian commercial real estate and turnkey businesses actually works, then walks through the offers with real deal examples and yields — verified properties, legal protection, full setup. Serious enquiries come in because nothing on the page feels like a pitch.",
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
    body: "The website of a Bucharest logistics company that moves oversized cargo across Moldova, Romania and the EU: escorted special transports, permits, vehicle transport, GPS tracking. The client updates news, the gallery and job postings themselves, no developer needed.",
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
    body: "One of our most recent builds: a website plus CMS for a US contractor working with concrete — cutting, core drilling, slab sawing, controlled demolition. The site connects them with clients across New England, and each service has its own page where they showcase real projects with photos and the story of the job. Through the CMS they manage it all themselves: projects, media, offers — no developer needed.",
  },
  {
    num: "09",
    slug: "palazzo",
    shotLabels: ["Clinic site", "Mobile booking", "Online appointments"],
    shotPositions: ["object-top", "object-center", "object-center"],
    client: "Wellness · Chișinău",
    name: "Palazzo Aesthetics",
    href: "https://palazzoaesthetics.md/",
    body: "A website for a clinic in Chișinău offering two kinds of care: physiotherapy, from manual therapy to rehabilitation, and phytotherapy, herbal treatments including their signature herbal compress. Patients read about the treatments and book an appointment online in three languages. Behind it sits a custom CMS, so the clinic manages its own content, news and appointments — no developer needed.",
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
      <div
        aria-hidden
        className={`pointer-events-none absolute top-1/4 size-96 rounded-full bg-primary/10 blur-3xl animate-glow-drift ${
          flipped ? "-right-24" : "-left-24"
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

// TODO: replace placeholder avatars with real client photos; each links to
// the client's live site from the works above
const ctaAvatars = [
  {
    imageUrl: "https://avatars.githubusercontent.com/u/16860528",
    profileUrl: "https://2marketing.ai",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/20110627",
    profileUrl: "https://app.wynnehomemanager.com/",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/106103625",
    profileUrl: "https://www.megawind.md",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/59228569",
    profileUrl: "https://dialogimobil.md",
  },
  {
    imageUrl: "/recommendations/redcore.jpg",
    profileUrl: "https://redcoreconcrete.com",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/89768406",
    profileUrl: "https://palazzoaesthetics.md/",
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
              className="-space-x-2"
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
