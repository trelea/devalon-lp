import { Code2, LifeBuoy, Smartphone, Sparkles } from "lucide-react"

import { DotPattern } from "@/components/ui/dot-pattern"
import { WobbleCard } from "@/components/ui/wobble-card"

type Service = {
  icon: typeof Code2
  title: string
  description: string
  /** background photo shown on the right half of the card */
  image?: string
}

const services: Service[] = [
  {
    icon: Code2,
    title: "Custom Development",
    description:
      "Web apps, platforms, APIs, internal tools — built from scratch around how you actually work, not around a template.",
    image: "/custom-dev.jpeg",
  },
  {
    icon: Sparkles,
    title: "AI Automation & Integration",
    description:
      "Automations, LLM features, and integrations that plug AI into your real workflows — solving problems, not chasing buzzwords.",
    image: "/ai-automation.jpeg",
  },
  {
    icon: LifeBuoy,
    title: "Maintenance & Support",
    description:
      "We keep software alive: bug fixes, updates, monitoring, and a human who answers when something breaks.",
    image: "/maintenance-support.jpeg",
  },
  {
    icon: Smartphone,
    title: "Application Development",
    description:
      "Mobile and desktop apps that feel native and ship properly — from the first build to the app stores and beyond.",
    image: "/app-dev.jpeg",
  },
]

export function Services() {
  return (
    <section
      id="services"
      className="relative isolate flex min-h-svh items-center overflow-hidden border-b border-border"
    >
      <DotPattern
        width={22}
        height={22}
        className="-z-10 fill-foreground/[0.03] [mask-image:radial-gradient(600px_circle_at_50%_0%,white,transparent)]"
      />
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 sm:py-24 xl:max-w-[88rem]">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Our services
        </h2>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Whatever stage your idea is at — we build it, ship it, and keep it
          running.
        </p>

        <div className="mt-8 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:grid-rows-2 sm:gap-4">
          {services.map((service) => (
            <WobbleCard
              key={service.title}
              containerClassName="min-h-56 bg-[oklch(0.32_0.09_262)] sm:min-h-80"
              className="relative flex h-full flex-col justify-between p-5 sm:p-10"
            >
              {service.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={service.image}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="pointer-events-none absolute inset-y-0 right-0 w-1/2 object-contain object-right opacity-50 grayscale [mask-image:linear-gradient(to_left,black_10%,rgba(0,0,0,0.7)_40%,rgba(0,0,0,0.3)_70%,transparent_95%)]"
                />
              )}
              <service.icon
                className="relative z-10 size-7 text-white sm:size-9"
                strokeWidth={2}
              />
              <div className="relative z-10">
                <h3 className="mt-4 text-xl font-medium tracking-tight text-white sm:mt-8 sm:text-2xl">
                  {service.title}
                </h3>
                <p className="mt-1.5 max-w-[66%] text-base font-light leading-snug text-blue-100/80 sm:mt-2.5 sm:text-lg sm:leading-relaxed">
                  {service.description}
                </p>
              </div>
            </WobbleCard>
          ))}
        </div>
      </div>
    </section>
  )
}
