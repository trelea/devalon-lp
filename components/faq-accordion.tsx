"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NavLink } from "@/components/nav-link";
import { AuroraText } from "@/components/ui/aurora-text";
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
import { track } from "@/lib/tracking";
import type { FaqData } from "@/components/sections/faq";

const FAQ_ICONS: LucideIcon[] = [
  Layers,
  Users,
  Compass,
  CircleDollarSign,
  Scale,
  ShieldCheck,
  Sparkles,
];

export function FaqAccordion({ faqs }: { faqs: FaqData[] }) {
  const [openValue, setOpenValue] = React.useState<string>("");
  const openedAtRef = React.useRef<Record<string, number>>({});

  const handleValueChange = (value: string) => {
    // closing previous
    if (openValue && openValue !== value) {
      const idx = parseInt(openValue.replace("item-", ""), 10);
      const faq = faqs[idx];
      const started = openedAtRef.current[openValue];
      track(
        "faq_close",
        {
          question: faq?.question,
          index: idx,
          duration_ms:
            started != null ? Math.round(performance.now() - started) : undefined,
        },
        undefined,
        { server: false }
      ).catch(() => {});
      delete openedAtRef.current[openValue];
    }

    if (value) {
      const idx = parseInt(value.replace("item-", ""), 10);
      const faq = faqs[idx];
      openedAtRef.current[value] = performance.now();
      track(
        "faq_open",
        { question: faq?.question, index: idx },
        undefined,
        { server: false }
      ).catch(() => {});
    } else if (openValue) {
      // fully collapsed
      const idx = parseInt(openValue.replace("item-", ""), 10);
      const faq = faqs[idx];
      const started = openedAtRef.current[openValue];
      track(
        "faq_close",
        {
          question: faq?.question,
          index: idx,
          duration_ms:
            started != null ? Math.round(performance.now() - started) : undefined,
        },
        undefined,
        { server: false }
      ).catch(() => {});
      delete openedAtRef.current[openValue];
    }

    setOpenValue(value);
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={openValue}
      onValueChange={handleValueChange}
      className="w-full border-t border-border"
    >
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.question} value={`item-${index}`}>
          <AccordionTrigger className="items-start py-5 text-left text-lg font-semibold sm:text-2xl">
            <span className="flex flex-1 items-start gap-3 sm:gap-4">
              {(() => {
                const Icon = FAQ_ICONS[index] ?? Layers;
                return (
                  <Icon
                    className="mt-0.5 size-5 shrink-0 text-primary sm:mt-1 sm:size-6"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                );
              })()}
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
                data-track="faq_cta"
                data-track-location="faq"
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
  );
}