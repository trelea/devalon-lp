import Link from "next/link"
import { ArrowDown, ArrowUpRight } from "lucide-react"

import { AnimationGate } from "@/components/ui/animation-gate"
import { Button } from "@/components/ui/button"
import { Particles } from "@/components/ui/particles"
import { Reveal, WordReveal } from "@/components/ui/reveal"
import { HeroVisual } from "@/components/sections/hero-visual"

const headline = "We turn ideas into working software."

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate w-screen max-w-full overflow-hidden border-b border-border"
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(120%_120%_at_50%_0%,oklch(0.955_0.018_254),oklch(0.984_0.003_248))]" />
      {/* aurora: pre-faded gradients drifting on transform only — replaces the
          BackgroundBeams/Spotlight stack, which Firefox couldn't keep at 60fps */}
      <AnimationGate className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-aurora-drift absolute -top-1/4 -left-1/4 h-[80%] w-[90%] bg-[radial-gradient(closest-side,hsla(221,83%,45%,0.08),transparent)]" />
        <div className="animate-aurora-drift absolute top-1/6 -right-1/5 h-[70%] w-[75%] bg-[radial-gradient(closest-side,hsla(221,80%,55%,0.06),transparent)] [animation-delay:-14s] [animation-duration:34s]" />
      </AnimationGate>
      <Particles
        className="absolute inset-0 -z-10"
        quantity={45}
        staticity={50}
        ease={70}
        size={0.5}
        color="#1d4ed8"
      />

      <div className="relative mx-auto grid min-h-svh w-full max-w-7xl items-center gap-6 px-6 pt-24 pb-8 sm:gap-12 sm:px-8 sm:pt-28 sm:pb-16 lg:grid-cols-2 lg:gap-8 xl:max-w-[88rem]">
        {/* left: copy */}
        <div className="flex flex-col items-start text-left">
          <h1 className="relative z-10 max-w-2xl text-3xl font-bold tracking-tight text-foreground/95 sm:text-5xl xl:text-6xl xl:leading-[1.08]">
            <WordReveal text={headline} accentFrom={4} />
          </h1>

          <Reveal delay={0.9}>
            <p className="relative z-10 mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground sm:mt-6 sm:text-2xl">
              Devalon is a development and consulting studio. We build,
              maintain, and scale software and AI solutions for individuals,
              startups, and enterprises.
            </p>
            <p className="relative z-10 mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground sm:mt-4 sm:text-2xl">
              Got an idea? Whether it&rsquo;s great, rough around the edges, or
              completely out there, bring it to us. We&rsquo;ll give you an
              honest take on what it would take to make it real.
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
