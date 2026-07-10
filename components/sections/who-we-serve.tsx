"use client"

import {
  Building2,
  Calendar,
  CreditCard,
  Database,
  Globe,
  Layers,
  Mail,
  Plug,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  User,
} from "lucide-react"

import { BorderBeam } from "@/components/ui/border-beam"
import { DotPattern } from "@/components/ui/dot-pattern"
import {
  FeatureCard,
  FeatureCardDescription,
  FeatureCardSkeleton,
  FeatureCardSkeletonContainer,
  FeatureCardTitle,
} from "@/components/ui/feature-block-card"

const audiences = [
  {
    scope: "individuals",
    icons: [Store, Calendar, User, Globe, Mail],
    title: "For individuals & small businesses",
    description:
      "Solo founders, local shops, small agencies — anyone who needs real software without the agency overhead. A website, a booking tool, a little app that saves you hours a week. No project is too small to be done properly.",
  },
  {
    scope: "startups",
    icons: [CreditCard, Plug, Rocket, Sparkles, TrendingUp],
    title: "For startups",
    description:
      "We build your product, keep it running, and integrate whatever your stack needs next — payments, AI, third-party APIs. You get a technical partner who has shipped with startups before, not a vendor you have to manage.",
  },
  {
    scope: "enterprise",
    icons: [Server, ShieldCheck, Building2, Database, Layers],
    title: "For enterprise teams",
    description:
      "The serious work: scaling systems, modernising legacy code, and custom solutions that have to hold up under real load. Clear scope, honest timelines, and code your own team can live with afterwards.",
  },
]

export function WhoWeServe() {
  return (
    <section
      id="who-we-serve"
      className="relative isolate flex min-h-svh items-center overflow-hidden border-b border-border"
    >
      <DotPattern
        width={22}
        height={22}
        className="-z-10 fill-foreground/[0.03] [mask-image:radial-gradient(600px_circle_at_50%_0%,white,transparent)]"
      />
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 sm:py-24 xl:max-w-[88rem]">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Who we work with
        </h2>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
          From a one-person idea to an enterprise roadmap — the work changes,
          the standard doesn&apos;t.
        </p>

        <div className="mt-8 grid gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-3">
          {audiences.map((audience, index) => (
            <FeatureCard key={audience.scope}>
              <FeatureCardSkeletonContainer>
                <FeatureCardSkeleton
                  icons={audience.icons}
                  scope={audience.scope}
                />
              </FeatureCardSkeletonContainer>
              <FeatureCardTitle>{audience.title}</FeatureCardTitle>
              <FeatureCardDescription>
                {audience.description}
              </FeatureCardDescription>
              <BorderBeam
                size={90}
                duration={9}
                delay={index * 3}
                colorFrom="#1d4ed8"
                colorTo="#60a5fa"
              />
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  )
}
