import { ArrowUpRight } from "lucide-react";
import {
  CircleDollarSign,
  Compass,
  Layers,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

import { AuroraText } from "@/components/ui/aurora-text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NavLink } from "@/components/nav-link";

export const faqs: {
  question: string;
  answer: string;
  icon: LucideIcon;
  points?: string[];
  cta?: { label: string; href: string };
}[] = [
  {
    question: "What does “full-cycle tech partner” actually mean?",
    answer:
      "Simply put: Devalon takes care of your product from the first idea to launch day, and long after. Planning, design, building, testing, going live, and keeping everything running smoothly. You get one team and one point of contact, instead of juggling agencies and freelancers.",
    icon: Layers,
    points: [
      "Planning: we work out what to build and how",
      "Design and build: from first sketches to a working product",
      "After launch: hosting, monitoring, and improvements",
    ],
    cta: { label: "Book a free intro call", href: "#contact" },
  },
  {
    question:
      "Why choose Devalon instead of hiring in-house or using freelancers?",
    answer:
      "Building your own team is a great long-term move, but it takes months and a lot of money before anything actually gets built. Freelancers are cheaper, but if one disappears or the quality varies, your project takes the hit. With us you get an experienced team that's ready to start now, and you can make it bigger or smaller whenever you need.",
    icon: Users,
    points: [
      "Start in days, not months",
      "Designers, developers, and testers all working together",
      "Everything we build belongs to you",
    ],
    cta: { label: "Get an honest estimate", href: "#contact" },
  },
  {
    question:
      "I'm not technical. How can I test my idea without risking a lot of money?",
    answer:
      "You don't need to speak “tech” to get started. We begin small: we turn your idea into simple screens you can click through, so you can show it to real people, customers, or investors and hear what they think. You only invest in the full product once you know it's worth building.",
    icon: Compass,
    points: [
      "We turn your idea into a clear list of features",
      "You get a clickable preview to test and show around",
      "The plan is agreed before we build the real thing",
    ],
    cta: { label: "Test your idea first", href: "#contact" },
  },
  {
    question: "How much will my first version cost, and how long will it take?",
    answer:
      "It depends on what you want to build: how many other tools it connects to, how many types of users it has, and whether you also need mobile apps. The good news is you don't have to guess. Tell us about your idea and we'll usually send you a realistic price range within a day, before you commit to anything. Most first versions are live in weeks, not months, and you can see real progress along the way.",
    icon: CircleDollarSign,
    points: [
      "A price range before you sign anything",
      "Start with the essentials, add extras once it's earning",
      "A clear scope, so your budget doesn't surprise you",
    ],
    cta: { label: "Get your estimate in 30 minutes", href: "#contact" },
  },
  {
    question: "Fixed price or pay-as-you-go: which is right for me?",
    answer:
      "If you know exactly what you want and the designs are ready, a fixed price is the safest: you know the total upfront. If you're still learning and adjusting as you go, which is normal for new businesses, paying for time in short, capped cycles gives you room to change direction without nasty surprises. We'll suggest whatever fits you best, not whatever earns us more.",
    icon: Scale,
    points: [
      "Fixed price: clear scope, clear total",
      "Pay-as-you-go: short cycles with a set limit, change priorities weekly",
      "Dedicated team: ideal for bigger, long-term plans",
    ],
    cta: { label: "Ask which option fits", href: "#contact" },
  },
  {
    question: "Who owns the work, and will I be stuck with Devalon?",
    answer:
      "You own it, and you're never stuck. Everything we make is yours: the code, the designs, the data setup, all of it. We use popular, widely known technologies (like React, Node.js, and PostgreSQL) and we hand over clear documentation, so any good team can pick up where we left off. If you ever want to move on, you can.",
    icon: ShieldCheck,
    points: [
      "You get all the files, access, and documentation",
      "Common technologies, nothing locked or secret",
      "Handover sessions so your team feels confident",
    ],
    cta: { label: "Ask about handover", href: "#contact" },
  },
  {
    question: "Can you add AI to my product, and is it safe?",
    answer:
      "Yes. We build AI features that work in the real world, not just in a demo: assistants that answer questions using your own documents, chatbots, tools that read and organize information for you. We test them carefully, set safety limits, and keep an eye on them after launch. Security is part of how we work from day one, with automatic checks, protected connections, and controlled access on every update.",
    icon: Sparkles,
    points: [
      "Every AI feature is tested, protected, and monitored",
      "Security checks run automatically with every update",
      "We keep watching and fixing things after launch",
    ],
    cta: { label: "Talk about your AI idea", href: "#contact" },
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative flex min-h-svh min-h-dvh w-full max-w-full scroll-mt-[72px] flex-col items-center justify-center overflow-x-clip bg-transparent"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-6 px-4 sm:gap-8 sm:px-5 lg:gap-8 xl:max-w-[88rem] xl:gap-10">
        <h2
          id="faq-heading"
          className="mx-auto max-w-4xl text-center text-3xl font-bold leading-[1.1] tracking-tight text-foreground text-balance sm:text-4xl"
        >
          Questions,{" "}
          <AuroraText
            colors={["#3B4354", "#4e6cb8", "#7196E0", "#5b7fd4"]}
            speed={1}
          >
            answered
          </AuroraText>
        </h2>

        <Accordion
          type="single"
          collapsible
          className="w-full border-t border-border"
        >
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger className="items-start py-5 text-left text-lg font-semibold sm:text-2xl">
                <span className="flex flex-1 items-start gap-3 sm:gap-4">
                  <faq.icon
                    className="mt-0.5 size-5 shrink-0 text-primary sm:mt-1 sm:size-6"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-3 pr-2 pb-10 pl-8 text-base leading-relaxed text-foreground/80 sm:pl-10 sm:text-lg">
                <p>{faq.answer}</p>
                {faq.points && (
                  <ul className="mt-4 space-y-2.5">
                    {faq.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className="mt-[0.75em] h-[2px] w-5 shrink-0 rounded-full bg-primary/60"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {faq.cta && (
                  <NavLink
                    href={faq.cta.href}
                    className="mt-6 inline-flex w-fit items-center gap-1.5 text-base font-medium underline underline-offset-4 sm:text-lg"
                  >
                    <AuroraText
                      colors={["#3B4354", "#4e6cb8", "#7196E0", "#5b7fd4"]}
                      speed={1}
                    >
                      {faq.cta.label}
                    </AuroraText>
                    <ArrowUpRight
                      className="size-4 text-[#4e6cb8]"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </NavLink>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
