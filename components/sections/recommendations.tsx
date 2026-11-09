import Image from "next/image";
import { Building2 } from "lucide-react";

import { AnimationGate } from "@/components/ui/animation-gate";
import { AuroraText } from "@/components/ui/aurora-text";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

// TODO: Palazzo Aesthetics' quote is a Devalon-written draft — get the
// client's sign-off (or their edited version) before deploying.
// - `name` is the customer: a company name or a real human name
// - `role` goes under it: the person's role, or the company's theme/industry
// - kind: "person"  → round initials avatar (or photo via `avatar`)
// - kind: "company" → round logo tile (via `avatar`) or building icon
// `avatar` is an optional image path in /public.
// `avatarClassName` overrides the tile background for logos that need it.
// `href` is optional — when set, the whole card links to the real source
// (LinkedIn recommendation, Google review, client site, …) in a new tab.
type Recommendation = {
  kind: "person" | "company";
  name: string;
  role: string;
  quote: string;
  avatar?: string;
  avatarClassName?: string;
  href?: string;
  /** still waiting on the real quote — kept in data but not rendered */
  draft?: boolean;
};

const recommendationMeta = [
  {
    key: "dimitryBizga",
    kind: "person",
    avatar: "/recommendations/dimitry-bizga.jpg",
    href: "https://www.linkedin.com/in/dimitry-bizga/",
  },
  {
    key: "inesaDita",
    kind: "person",
    avatar: "/recommendations/inesa-dita.webp",
    href: "https://www.compass.com/agents/inesa-dita/",
  },
  {
    key: "redCoreConcrete",
    kind: "company",
    avatar: "/recommendations/redcore.jpg",
    href: "https://redcoreconcrete.com/",
  },
  {
    key: "thomasBachPetersen",
    kind: "person",
    avatar: "/recommendations/thomas-bach-petersen.jpg",
    href: "https://www.linkedin.com/in/thomasbach/",
  },
  {
    key: "marketingAi",
    kind: "company",
    avatar: "/recommendations/2marketing.jpg",
    href: "https://2marketing.ai/",
  },
  {
    key: "vasileBorogan",
    kind: "person",
    avatar: "/recommendations/vasile-borogan.jpg",
    href: "https://www.linkedin.com/in/vasile-borogan-bb1638114/",
  },
  {
    key: "palazzoAesthetics",
    kind: "company",
    avatar: "/recommendations/palazzo-aesthetics.svg",
    avatarClassName: "bg-[#f2eee4]",
    href: "https://palazzoaesthetics.md",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function RecommendationCard({
  kind,
  name,
  role,
  quote,
  avatar,
  avatarClassName,
  href,
}: Recommendation) {
  const card = (
    <figure className="relative isolate flex flex-col overflow-hidden rounded-[1.25rem] bg-white p-5 text-foreground shadow-[0_10px_30px_-12px_rgba(59,67,84,0.35)] transition-shadow hover:shadow-[0_14px_36px_-12px_rgba(59,67,84,0.4)] sm:rounded-[1.75rem] sm:p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_100%_at_80%_0%,rgba(113,150,224,0.06),transparent)]"
      />
      <figcaption className="flex items-center gap-2.5 sm:gap-3">
        <span
          className={cn(
            kind === "company"
              ? "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary text-primary sm:size-11"
              : "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs font-semibold text-primary sm:size-11 sm:text-sm",
            avatarClassName,
          )}
        >
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={52}
              height={52}
              className="size-full object-cover"
            />
          ) : kind === "company" ? (
            <Building2 className="size-4.5 sm:size-6" strokeWidth={1.5} />
          ) : (
            initials(name)
          )}
        </span>
        <span className="leading-snug">
          <span className="block text-base font-semibold tracking-tight text-foreground sm:text-lg">
            {name}
          </span>
          <span className="block text-sm text-muted-foreground sm:text-[13px]">
            {role}
          </span>
        </span>
      </figcaption>
      <blockquote className="mt-3 text-sm leading-snug text-foreground/85 sm:mt-4 sm:text-base sm:leading-relaxed">
        {quote}
      </blockquote>
    </figure>
  );

  if (!href) return card;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {card}
    </a>
  );
}

// (live/columns/mobileOrdered are computed inside the component from translated data)

export async function Recommendations({ locale: localeProp }: { locale?: string }) {
  const locale = localeProp ?? (await getLocale());
  const t = await getTranslations({ locale, namespace: "Recommendations" });

  const recommendations = recommendationMeta.map((m) => ({
    kind: m.kind as "person" | "company",
    name: t(`items.${m.key}.name`),
    role: t(`items.${m.key}.role`),
    quote: t(`items.${m.key}.quote`),
    avatar: m.avatar,
    avatarClassName: m.avatarClassName,
    href: m.href,
    draft: false,
  }));

  // only cards with real quotes render (mark an entry `draft: true` to hide it).
  const live = recommendations.filter((rec) => !rec.draft);
  const columns = [
    { items: live.slice(0, 2), duration: "80s", reverse: false },
    { items: live.slice(2, 5), duration: "100s", reverse: true },
    { items: live.slice(5), duration: "90s", reverse: false },
  ];
  const mobileOrdered = [
    ...columns[1].items,
    ...columns[2].items,
    ...columns[0].items,
  ];

  return (
    <section
      id="recommendations"
      className="relative isolate flex h-svh h-dvh scroll-mt-[72px] flex-col justify-center overflow-hidden bg-[linear-gradient(to_bottom_in_oklch,transparent_0%,#f3f4f600_6%,#f1f3f8_14%,#dde4f1_24%,#c2cfe8_36%,#c2d2ec_48%,#b4c6e6_60%,#a8c4f0_75%)]"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 sm:gap-10 sm:px-8 sm:py-16 xl:max-w-[88rem]">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-foreground text-balance sm:text-4xl">
            {t("titlePrefix")}
            <br className="sm:hidden" />
            <span className="sm:inline">
              {" "}
              <AuroraText
                colors={["#3B4354", "#4e6cb8", "#7196E0", "#5b7fd4"]}
                speed={1}
              >
                {t("titleHighlight")}
              </AuroraText>
            </span>
          </h2>
        </div>

        <AnimationGate
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          // style={{
          //   maskImage:
          //     "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.08) 6%, rgba(0,0,0,0.45) 11%, black 18%, black 82%, rgba(0,0,0,0.45) 89%, rgba(0,0,0,0.08) 94%, transparent 100%)",
          //   WebkitMaskImage:
          //     "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.08) 6%, rgba(0,0,0,0.45) 11%, black 18%, black 82%, rgba(0,0,0,0.45) 89%, rgba(0,0,0,0.08) 94%, transparent 100%)",
          // }}

          // style={{
          //   maskImage:
          //     "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 8%, rgba(0,0,0,0.6) 18%, black 30%, black 70%, rgba(0,0,0,0.6) 82%, rgba(0,0,0,0.2) 92%, transparent 100%)",
          //   WebkitMaskImage:
          //     "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 8%, rgba(0,0,0,0.6) 18%, black 30%, black 70%, rgba(0,0,0,0.6) 82%, rgba(0,0,0,0.2) 92%, transparent 100%)",
          // }}
          //
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          {/* mobile: a single column cycling through every card */}
          <Marquee
            vertical
            pauseOnHover
            repeat={2}
            className="h-[calc(100svh-11rem)] h-[calc(100dvh-11rem)] min-h-[26rem] p-0 sm:hidden"
            style={
              {
                "--duration": "130s",
                "--gap": "1.25rem",
              } as React.CSSProperties
            }
          >
            {mobileOrdered.map((rec) => (
              <RecommendationCard key={rec.name} {...rec} />
            ))}
          </Marquee>
          {columns.map((column, index) => (
            <Marquee
              key={index}
              vertical
              pauseOnHover
              repeat={3}
              reverse={column.reverse}
              className={
                index === 0
                  ? "hidden h-[calc(100svh-11rem)] h-[calc(100dvh-11rem)] min-h-[26rem] p-0 sm:flex sm:h-[min(50rem,calc(100svh-14rem))] sm:h-[min(50rem,calc(100dvh-14rem))] sm:min-h-0"
                  : index === 1
                    ? "hidden h-[calc(100svh-11rem)] h-[calc(100dvh-11rem)] min-h-[26rem] p-0 sm:flex sm:h-[min(50rem,calc(100svh-14rem))] sm:h-[min(50rem,calc(100dvh-14rem))] sm:min-h-0"
                    : "hidden h-[calc(100svh-11rem)] h-[calc(100dvh-11rem)] min-h-[26rem] p-0 sm:h-[min(50rem,calc(100svh-14rem))] sm:h-[min(50rem,calc(100dvh-14rem))] sm:min-h-0 lg:flex"
              }
              style={
                {
                  "--duration": column.duration,
                  "--gap": "1.25rem",
                } as React.CSSProperties
              }
            >
              {column.items.map((rec) => (
                <RecommendationCard key={rec.name} {...rec} />
              ))}
            </Marquee>
          ))}
        </AnimationGate>
      </div>
    </section>
  );
}
