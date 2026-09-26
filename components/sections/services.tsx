import { Code2, LifeBuoy, Smartphone, Sparkles } from "lucide-react";

import { AuroraText } from "@/components/ui/aurora-text";
import { Tabs } from "@/components/ui/tabs";

type Service = {
  icon: typeof Code2;
  title: string;
  description: string;
  /** background photo shown on the right half of the card */
  image?: string;
};

const services: Service[] = [
  {
    icon: Code2,
    title: "Digital Solutions",
    description:
      "Custom CRMs, ERPs, admin panels, booking, inventory & client portals — built from scratch around your ops, not a template. We replace sheets and SaaS limits with your own system: pipelines, roles & permissions, finance & reporting, automations and clean APIs that scale and never lock you in.",
    image: "/custom-dev.jpeg",
  },
  {
    icon: LifeBuoy,
    title: "Cloud Infrastructure",
    description:
      "AWS, Docker, CI/CD, backups, monitoring & uptime — we keep it alive and scaling. Proactive alerts, cost & performance tuning, and a direct engineer who knows your codebase answers when something breaks. Documented, handover-ready, no ticket hell.",
    image: "/maintenance-support.jpeg",
  },
  {
    icon: Sparkles,
    title: "AI Integrations",
    description:
      "RAG over your docs, chatbots & voice agents, data extraction, auto-CRM enrichment and lead/content autopilot — plugged straight into your CRM, ERP or support flow. Production-grade on OpenAI/Anthropic with evals, guardrails and monitoring. Saves hours, not just demos.",
    image: "/ai-automation.jpeg",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "iOS, Android, PWA and desktop apps that feel native and ship properly — offline, push, payments and store delivery handled. AI chat, search and automation inside the app, plus crash reporting, staged rollouts and continuous iteration post-launch.",
    image: "/app-dev.jpeg",
  },
];

export function Services() {
  const tabs = services.map((service) => ({
    title: service.title,
    value: service.title,
    content: (
      <div className="relative flex min-h-[64svh] flex-col gap-6 overflow-hidden rounded-[1.5rem] bg-[oklch(0.32_0.09_262)] p-6 pb-48 sm:min-h-[65svh] sm:gap-8 sm:rounded-[2rem] sm:p-8 sm:pb-56 md:pb-64 lg:h-[63svh] lg:min-h-0 lg:gap-16 lg:rounded-[3.5rem] lg:p-12">
        {service.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.image}
            alt=""
            aria-hidden
            loading="lazy"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] w-full object-cover object-bottom opacity-50 grayscale [mask-image:linear-gradient(to_top,black_0%,black_15%,rgba(0,0,0,0.9)_30%,rgba(0,0,0,0.6)_50%,rgba(0,0,0,0.25)_70%,rgba(0,0,0,0.08)_85%,transparent_95%)] lg:inset-y-0 lg:right-0 lg:bottom-auto lg:left-auto lg:h-full lg:w-1/2 lg:object-cover lg:object-right lg:opacity-60 lg:[mask-image:linear-gradient(to_left,black_0%,black_15%,rgba(0,0,0,0.9)_30%,rgba(0,0,0,0.6)_50%,rgba(0,0,0,0.25)_70%,rgba(0,0,0,0.08)_85%,transparent_95%)]"
          />
        )}
        <div className="relative z-10 flex items-center gap-3 sm:gap-4 lg:gap-5">
          <service.icon
            className="size-7 shrink-0 text-white sm:size-9 lg:size-14"
            strokeWidth={2}
          />
          <h3 className="text-xl font-medium tracking-tight text-white sm:text-2xl lg:text-4xl">
            {service.title}
          </h3>
        </div>
        <p className="relative z-10 max-w-full text-lg leading-snug font-medium text-blue-100/80 sm:text-xl sm:leading-relaxed lg:max-w-[50%]">
          {service.description}
        </p>
      </div>
    ),
  }));

  return (
    <section
      id="services"
      className="relative flex w-screen max-w-full scroll-mt-[72px] flex-col items-center justify-start overflow-x-clip py-10 sm:py-12 lg:h-[calc(100svh-5rem)] lg:min-h-0 lg:justify-center lg:py-0 bg-transparent"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-8 px-4 py-0 sm:gap-10 sm:px-5 lg:min-h-0 xl:max-w-[88rem] bg-transparent">
        <h2 className="mx-auto max-w-4xl text-center text-3xl font-bold leading-[1.1] tracking-tight text-foreground text-balance sm:text-4xl">
          Modern Software Solutions &{" "}
          <AuroraText
            colors={["#3B4354", "#4e6cb8", "#7196E0", "#5b7fd4"]}
            speed={1}
          >
            AI, Data, Cloud
          </AuroraText>
        </h2>

        <div className="flex w-full flex-col items-center">
          <Tabs
            containerClassName="w-full h-full justify-center items-center gap-2 md:gap-6 lg:gap-10"
            tabs={tabs}
          />
        </div>
      </div>
    </section>
  );
}
