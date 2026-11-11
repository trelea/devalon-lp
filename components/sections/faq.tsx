import { AuroraText } from "@/components/ui/aurora-text";
import { FaqAccordion } from "@/components/faq-accordion";
import { getLocale, getTranslations } from "next-intl/server";

export type FaqData = {
  question: string;
  answer: string;
  points?: string[];
  cta?: { label: string; href: string };
};

export async function getFaqs(locale?: string): Promise<FaqData[]> {
  const loc = locale ?? (await getLocale());
  const t = await getTranslations({ locale: loc, namespace: "Faq" });
  const items = t.raw("items") as {
    question: string;
    answer: string;
    points?: string[];
    cta?: string;
  }[];
  return items.map((item) => ({
    question: item.question,
    answer: item.answer,
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

        <FaqAccordion faqs={faqs} />
      </div>
    </section>
  );
}