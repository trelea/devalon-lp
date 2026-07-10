import { Cloud, ShieldCheck, TrendingUp, Unlock } from "lucide-react"
import {
  siAnthropic,
  siDocker,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siTypescript,
} from "simple-icons"

import { cn } from "@/lib/utils"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal"

// OpenAI was removed from simple-icons; inline its official mark.
const openai = {
  title: "OpenAI",
  path: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
}

type BrandIcon = { title: string; path: string }

function Glyph({ icon, className }: { icon: BrandIcon; className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      aria-label={icon.title}
      className={cn("fill-current", className)}
    >
      <path d={icon.path} />
    </svg>
  )
}

const stack: { label: string; icon?: BrandIcon }[] = [
  { label: "React", icon: siReact as BrandIcon },
  { label: "Next.js", icon: siNextdotjs as BrandIcon },
  { label: "TypeScript", icon: siTypescript as BrandIcon },
  { label: "Node.js", icon: siNodedotjs as BrandIcon },
  { label: "Python", icon: siPython as BrandIcon },
  { label: "PostgreSQL", icon: siPostgresql as BrandIcon },
  { label: "Docker", icon: siDocker as BrandIcon },
  { label: "OpenAI", icon: openai },
  { label: "Anthropic", icon: siAnthropic as BrandIcon },
  { label: "AWS" },
]

const proofPoints = [
  {
    icon: ShieldCheck,
    title: "Battle-tested",
    text: "Trusted by teams worldwide.",
  },
  {
    icon: TrendingUp,
    title: "Built to scale",
    text: "From MVP to millions of users.",
  },
  {
    icon: Unlock,
    title: "No lock-in",
    text: "Any developer can take over.",
  },
]

export function TechStack() {
  return (
    <section
      id="stack"
      className="relative isolate flex min-h-svh items-center overflow-hidden border-b border-border"
    >
      <FlickeringGrid
        className="absolute inset-0 -z-10 [mask-image:radial-gradient(900px_circle_at_70%_50%,white,transparent)]"
        squareSize={4}
        gridGap={7}
        color="#2563eb"
        maxOpacity={0.2}
        flickerChance={0.18}
      />
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16 xl:max-w-[88rem]">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tech stack
          </h2>
          <p className="mt-3 max-w-xl text-xl leading-relaxed text-muted-foreground">
            We build on proven, industry-standard technology used in
            production by companies worldwide — so your product ships on
            schedule, scales reliably, and stays maintainable by any
            engineering team. No experimental dependencies, no vendor lock-in.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {stack.map((tech) => (
              <span
                key={tech.label}
                className="inline-flex w-full items-center gap-2 rounded-full border border-border bg-secondary/60 py-1.5 pr-4 pl-2 text-sm font-medium text-foreground/85 transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-background">
                  {tech.icon ? (
                    <Glyph icon={tech.icon} className="size-3.5" />
                  ) : (
                    <Cloud className="size-3.5" strokeWidth={1.75} />
                  )}
                </span>
                {tech.label}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {proofPoints.map((point) => (
              <div key={point.title} className="flex items-start gap-3">
                <point.icon
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="font-medium text-foreground">{point.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {point.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden w-full lg:flex">
          <Terminal className="dark max-h-none min-h-[30rem] w-full max-w-none bg-card/95 font-mono shadow-2xl shadow-black/40 backdrop-blur-sm">
            <TypingAnimation className="text-neutral-100">
              $ npx create-devalon-app my-idea
            </TypingAnimation>

            <AnimatedSpan className="text-emerald-400">
              ✔ Scaffolding Next.js + React + TypeScript
            </AnimatedSpan>
            <AnimatedSpan className="text-emerald-400">
              ✔ Wiring Node.js & Python services
            </AnimatedSpan>
            <AnimatedSpan className="text-emerald-400">
              ✔ Connecting OpenAI + Anthropic
            </AnimatedSpan>
            <AnimatedSpan className="text-emerald-400">
              ✔ Provisioning PostgreSQL on AWS
            </AnimatedSpan>
            <AnimatedSpan className="text-emerald-400">
              ✔ Docker, CI/CD & monitoring ready
            </AnimatedSpan>

            <AnimatedSpan className="text-sky-400">
              ℹ 0 exotic bets · 0 lock-in
            </AnimatedSpan>

            <TypingAnimation className="text-neutral-400">
              Success! Your idea is ready to build.
            </TypingAnimation>
          </Terminal>
        </div>
      </div>
    </section>
  )
}
