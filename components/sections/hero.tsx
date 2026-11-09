import { ArrowDown, ArrowUpRight } from "lucide-react";

import { NavLink } from "@/components/nav-link";
import { getLocale, getTranslations } from "next-intl/server";

import { AuroraText } from "@/components/ui/aurora-text";
import { Button } from "@/components/ui/button";
import { HeroGlobeLazy } from "./hero-globe-lazy";

// Server-rendered copy + CTAs paint immediately for LCP/SEO; the decorative
// WebGL globe hydrates separately on the client and never blocks the H1.

export async function Hero({ locale: localeProp }: { locale?: string }) {
  const locale = localeProp ?? (await getLocale());
  const t = await getTranslations({ locale, namespace: "Hero" });
  return (
    <section
      id="top"
      className="relative flex min-h-svh min-h-dvh w-screen max-w-full flex-col overflow-hidden pt-[72px] sm:pt-20 lg:h-svh lg:h-dvh"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-3 py-4 max-[360px]:px-2 max-[360px]:py-3 sm:px-4 sm:py-6 md:px-5 md:py-8 lg:px-5 lg:py-6 xl:max-w-[88rem] xl:px-4 xl:py-6">
        {/* centered card — balanced + 320px tweak */}
        <div className="grid w-full overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_45px_-20px_rgba(15,23,42,0.22)] max-[360px]:rounded-[1.25rem] sm:rounded-[2rem] md:rounded-[2.5rem] lg:grid-cols-2 lg:rounded-[3rem] xl:rounded-[3.5rem] min-h-[calc(100svh-72px-2rem)] min-h-[calc(100dvh-72px-2rem)] max-[360px]:min-h-[calc(100svh-72px-1.5rem)] max-[360px]:min-h-[calc(100dvh-72px-1.5rem)] sm:min-h-[calc(100svh-72px-3rem)] sm:min-h-[calc(100dvh-72px-3rem)] md:min-h-[calc(100svh-72px-4rem)] md:min-h-[calc(100dvh-72px-4rem)] lg:min-h-[calc(100svh-72px-7rem)] lg:min-h-[calc(100dvh-72px-7rem)] xl:min-h-[calc(100svh-16rem)] xl:min-h-[calc(100dvh-16rem)] 2xl:min-h-[calc(100svh-14rem)] 2xl:min-h-[calc(100dvh-14rem)]">
          {/* left: copy — balanced centered + 320px smaller, tighter on 1920 */}
          <div className="flex flex-col items-start justify-center bg-white px-5 py-6 text-left max-[360px]:px-4 max-[360px]:py-4 sm:px-6 sm:py-7 md:px-7 md:py-8 lg:px-8 lg:py-8 xl:px-10 xl:py-10 2xl:px-12 2xl:py-14">
            <h1 className="relative z-10 max-w-2xl px-2 text-3xl font-bold tracking-tight text-foreground/95 max-[360px]:text-[1.65rem] max-[360px]:leading-tight sm:text-4xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl xl:leading-[1.08]">
              {t("titlePrefix")}{" "}
              <AuroraText
                colors={["#3B4354", "#4e6cb8", "#7196E0", "#5b7fd4"]}
                speed={1}
              >
                {t("titleHighlight")}
              </AuroraText>
            </h1>

            <p className="relative z-10 mt-3 max-w-xl px-2 text-base leading-relaxed text-muted-foreground max-[360px]:mt-2 max-[360px]:text-sm max-[360px]:leading-snug sm:mt-4 sm:text-lg md:text-lg lg:mt-5 lg:text-xl xl:mt-5 xl:text-xl 2xl:mt-6 2xl:text-2xl">
              {t("subtitle")}
            </p>

            <div className="relative z-10 mt-5 flex w-full flex-col items-start gap-2 px-2 max-[360px]:mt-4 max-[360px]:gap-1.5 sm:mt-6 sm:gap-3 md:mt-6 lg:mt-6 xl:mt-8 2xl:mt-10 sm:w-auto sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-auto min-h-11 w-full gap-1.5 rounded-full border-0 bg-[#4e6cb8] px-7 py-2.5 text-center text-base leading-tight text-white shadow-lg shadow-[#4e6cb8]/30 hover:bg-[#4e6cb8]/90 max-[360px]:min-h-10 max-[360px]:px-6 max-[360px]:text-sm sm:w-auto sm:min-w-[10rem] sm:whitespace-nowrap"
              >
                <NavLink href="#contact">
                  {t("startProject")}
                  <ArrowUpRight className="size-4 max-[360px]:size-3.5" strokeWidth={1.75} />
                </NavLink>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-auto min-h-11 w-full gap-1.5 rounded-full border-0 px-7 py-2.5 text-center text-base leading-tight shadow-md shadow-black/10 max-[360px]:min-h-10 max-[360px]:px-6 max-[360px]:text-sm sm:w-auto sm:min-w-[10rem] sm:whitespace-nowrap"
              >
                <NavLink href="#work">
                  {t("seeWork")}
                  <ArrowDown className="size-4 max-[360px]:size-3.5" strokeWidth={1.75} />
                </NavLink>
              </Button>
            </div>
          </div>

          {/* right: blue globe on deep-space cell, full-bleed — 320px a little smaller */}
          <HeroGlobeLazy />
        </div>
      </div>
    </section>
  );
}
