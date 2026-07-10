import Link from "next/link"
import { ArrowDown, ArrowUpRight } from "lucide-react"

import { BackgroundBeams } from "@/components/ui/background-beams"
import { Button } from "@/components/ui/button"
import { Particles } from "@/components/ui/particles"
import { Reveal, WordReveal } from "@/components/ui/reveal"
import { Spotlight } from "@/components/ui/spotlight"
import { HeroVisual } from "@/components/sections/hero-visual"

const headline = "We turn ideas into working software."

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate w-screen max-w-full overflow-hidden border-b border-border"
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(120%_120%_at_50%_0%,oklch(0.955_0.018_254),oklch(0.984_0.003_248))]" />
      <BackgroundBeams className="pointer-events-none -z-10 opacity-70" />
      <Particles
        className="absolute inset-0 -z-10"
        quantity={90}
        staticity={50}
        ease={70}
        size={0.5}
        color="#1d4ed8"
      />
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(221, 83%, 45%, .10) 0, hsla(221, 80%, 50%, .04) 50%, transparent 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(221, 83%, 45%, .07) 0, hsla(221, 80%, 50%, .03) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(221, 83%, 45%, .05) 0, hsla(221, 80%, 50%, .02) 80%, transparent 100%)"
      />

      <div className="relative mx-auto grid min-h-svh w-full max-w-7xl items-center gap-6 px-6 pt-24 pb-8 sm:gap-12 sm:px-8 sm:pt-28 sm:pb-16 lg:grid-cols-2 lg:gap-8 xl:max-w-[88rem]">
        {/* left: copy */}
        <div className="flex flex-col items-start text-left">
          <h1 className="relative z-10 max-w-2xl text-3xl font-bold tracking-tight text-foreground/95 sm:text-5xl xl:text-6xl xl:leading-[1.08]">
            <WordReveal text={headline} accentFrom={4} />
          </h1>

          <Reveal delay={0.9}>
            <p className="relative z-10 mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground sm:mt-6 sm:text-2xl">
              Devalon builds, maintains, and scales software for individuals,
              startups, and enterprises. Bring us the idea — good or bad, real
              or delusional — and we&apos;ll tell you honestly how to make it
              real.
            </p>
          </Reveal>

          <Reveal
            delay={1.05}
            className="relative z-10 mt-6 flex w-full flex-col items-start gap-3 sm:mt-10 sm:w-auto sm:flex-row"
          >
            <Button asChild size="lg" className="h-11 w-full gap-1.5 text-base sm:w-44">
              <Link href="#contact">
                Get in touch
                <ArrowUpRight className="size-4" strokeWidth={1.75} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 w-full gap-1.5 text-base sm:w-44"
            >
              <Link href="#work">
                Our Work
                <ArrowDown className="size-4" strokeWidth={1.75} />
              </Link>
            </Button>
          </Reveal>
        </div>

        {/* right: animated app / api / database visual */}
        <Reveal delay={0.6} duration={0.6} scale className="relative z-10 w-full">
          <HeroVisual />
        </Reveal>
      </div>
    </section>
  )
}
