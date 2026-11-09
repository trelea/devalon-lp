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
import { getLocale, getTranslations } from "next-intl/server";

const FAQ_ICONS: LucideIcon[] = [
  Layers,
  Users,
  Compass,
  CircleDollarSign,
  Scale,
  ShieldCheck,
  Sparkles,
];

export type FaqItem = {
  question: string;
  answer: string;
  icon: LucideIcon;
  points?: string[];
  cta?: { label: string; href: string };
};

export async function getFaqs(locale?: string): Promise<FaqItem[]> {
  const loc = locale ?? (await getLocale());
  const t = await getTranslations({ locale: loc, namespace: "Faq" });
  const items = t.raw("items") as {
    question: string;
    answer: string;
    points?: string[];
    cta?: string;
  }[];
  return items.map((item, index) => ({
    question: item.question,
    answer: item.answer,
    icon: FAQ_ICONS[index] ?? Layers,
    points: item.points,
    cta: item.cta ? { label: item.cta, href: "#contact" } : undefined,
  }));
}

export async function Faq({ locale: localeProp }: { locale?: string }) {
  const locale = localeProp ?? (await getLocale());
  const t = await getTranslations({ locale, namespace: "Faq" });
  const faqs = await getFaqs(locale);

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
          {t("titlePrefix")}{" "}
          <AuroraText
            colors={["#3B4354", "#4e6cb8", "#7196E0", "#5b7fd4"]}
            speed={1}
          >
            {t("titleHighlight")}
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
