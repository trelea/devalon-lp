
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ContactModal } from "@/components/contact-modal";
import { ContactCta } from "@/components/sections/contact-cta";
import { WorkStoryCards } from "@/components/sections/work-story-cards";
import { AuroraText } from "@/components/ui/aurora-text";
import { LayoutGrid, type LayoutGridCard } from "@/components/ui/layout-grid";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import {
  devalonSocials,
  founderJobTitle,
  founderLinkedIn,
  founderName,
  siteCity,
  siteCountryCode,
  siteEmail,
  siteName,
  sitePhoneHref,
  siteStudioDescription,
  siteUrl,
} from "@/lib/site";
import {
  getCoverSrc,
  getPrevNextWork,
  getWorkBySlug,
  getWorkDescription,
  getWorkSlugs,
} from "@/lib/works";

const AURORA_COLORS = ["#3B4354", "#4e6cb8", "#7196E0", "#5b7fd4"];

export const dynamicParams = false;

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getWorkSlugs().map((slug) => ({ locale, slug }))
  );
}

function getGallerySrcs(slug: string): string[] {
  const dir = join(process.cwd(), "public", "works", slug);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => /^\d+\.webp$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => `/works/${slug}/${file}`);
}

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const OG_LOCALE_MAP: Record<string, string> = {
  ro: "ro_RO",
  ru: "ru_RU",
  en: "en_US",
  es: "es_ES",
  da: "da_DK",
  de: "de_DE",
  fr: "fr_FR",
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) return {};
  const tMeta = await getTranslations({ locale, namespace: "Metadata" });
  const tProjects = await getTranslations({ locale, namespace: "Projects" });
  const tWorks = await getTranslations({ locale, namespace: "Works" });
  const client = tProjects.has(`items.${slug}.client`)
    ? tProjects(`items.${slug}.client`)
    : work.client;
  const localizedBody = tWorks.has(`items.${slug}.body`)
    ? tWorks(`items.${slug}.body`)
    : work.body;
  const localizedWork = { ...work, body: localizedBody };
  const description = getWorkDescription(localizedWork);
  const url = `/${locale}/work/${work.slug}`;
  const industry = client.split("·")[0].trim();
  const languages = Object.fromEntries([
    ...routing.locales.map((l) => [l, `/${l}/work/${work.slug}`]),
    ["x-default", `/en/work/${work.slug}`],
  ]);
  return {
    title: `${work.name} — ${tMeta("caseStudy")}: ${industry} | ${siteName}`,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "article",
      url: `${siteUrl}${url}`,
      siteName,
      locale: OG_LOCALE_MAP[locale] ?? "en_US",
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE_MAP[l] ?? "en_US"),
      title: `${work.name} — ${siteName} ${tMeta("caseStudy")}`,
      description,
      publishedTime: "2026-01-01T00:00:00Z",
      modifiedTime: "2026-11-09T00:00:00Z",
      authors: [siteUrl],
      images: [
        {
          url: `${siteUrl}${url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${work.name} — ${client} · ${tMeta("caseStudy")} ${siteName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${work.name} — ${siteName} ${tMeta("caseStudy")}`,
      description,
      images: [
        {
          url: `${siteUrl}${url}/opengraph-image`,
          alt: `${work.name} — ${client} · ${tMeta("caseStudy")} ${siteName}`,
        },
      ],
    },
  };
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const work = getWorkBySlug(slug);
  if (!work) notFound();
  const tProjects = await getTranslations({ locale, namespace: "Projects" });
  const tWorks = await getTranslations({ locale, namespace: "Works" });
  const tMeta = await getTranslations({ locale, namespace: "Metadata" });
  const client = tProjects.has(`items.${slug}.client`)
    ? tProjects(`items.${slug}.client`)
    : work.client;
  const localizedBody = tWorks.has(`items.${slug}.body`)
    ? tWorks(`items.${slug}.body`)
    : work.body;
  const localizedChallenge = tWorks.has(`items.${slug}.challenge`)
    ? tWorks(`items.${slug}.challenge`)
    : work.challenge;
  const localizedSolution = tWorks.has(`items.${slug}.solution`)
    ? tWorks(`items.${slug}.solution`)
    : work.solution;
  const localizedHighlights = tWorks.has(`items.${slug}.highlights`)
    ? (tWorks.raw(`items.${slug}.highlights`) as string[])
    : work.highlights;
  const localizedMetrics = tWorks.has(`items.${slug}.metrics`)
    ? (tWorks.raw(`items.${slug}.metrics`) as { value: string; label: string }[])
    : (work.metrics ?? []);
  const localizedShotLabels = tWorks.has(`items.${slug}.shotLabels`)
    ? (tWorks.raw(`items.${slug}.shotLabels`) as string[])
    : work.shotLabels;
  const gallery = getGallerySrcs(work.slug);
  const cover = getCoverSrc(work);
  const { prev, next } = getPrevNextWork(work.slug);
  const pageUrl = `${siteUrl}/work/${work.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#work`,
        headline: `${work.name} — ${client}`,
        description: localizedBody,
        url: pageUrl,
        image: [`${siteUrl}${cover}`],
        inLanguage: locale,
        datePublished: "2026-01-01",
        dateModified: "2026-11-09",
        author: { "@type": "Organization", name: siteName, url: siteUrl },
        publisher: { "@type": "Organization", name: siteName, url: siteUrl, logo: { "@type": "ImageObject", url: `${siteUrl}/icons/icon-512.png` } },
        creator: { "@id": `${siteUrl}/#founder` },
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@type": "Thing", name: client.split("·")[0].trim() },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/${locale}` },
          { "@type": "ListItem", position: 2, name: tMeta("caseStudy"), item: `${siteUrl}/${locale}/#work` },
          { "@type": "ListItem", position: 3, name: work.name, item: pageUrl },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${work.name} — ${client}`,
        description: getWorkDescription({ ...work, body: localizedBody }),
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${pageUrl}#work` },
        inLanguage: locale,
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#founder`,
        name: founderName,
        jobTitle: founderJobTitle,
        url: siteUrl,
        worksFor: { "@id": `${siteUrl}/#organization` },
        sameAs: [founderLinkedIn],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: locale,
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        alternateName: "Devalon — AI & Software Development Studio",
        url: siteUrl,
        logo: `${siteUrl}/icons/icon-512.png`,
        description: siteStudioDescription,
        email: siteEmail,
        telephone: sitePhoneHref.replace("tel:", ""),
        address: {
          "@type": "PostalAddress",
          addressLocality: siteCity,
          addressRegion: siteCity,
          addressCountry: siteCountryCode,
        },
        founder: { "@id": `${siteUrl}/#founder` },
        sameAs: [...devalonSocials],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="flex w-full flex-1 flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-24">
        <section className="relative flex min-h-svh min-h-dvh w-full max-w-full flex-col pt-[72px] sm:pt-20 lg:h-svh lg:h-dvh">
          <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-3 py-4 sm:px-4 sm:py-6 md:px-5 md:py-8 lg:px-5 lg:py-6 xl:max-w-[88rem] xl:px-4 xl:py-6">
            <div className="grid w-full overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_45px_-20px_rgba(15,23,42,0.22)] sm:rounded-[2rem] lg:grid-cols-2 lg:rounded-[3rem] min-h-[calc(100svh-72px-2rem)] min-h-[calc(100dvh-72px-2rem)] sm:min-h-[calc(100svh-72px-3rem)] sm:min-h-[calc(100dvh-72px-3rem)] md:min-h-[calc(100svh-72px-4rem)] md:min-h-[calc(100dvh-72px-4rem)] lg:min-h-[calc(100svh-72px-7rem)] lg:min-h-[calc(100dvh-72px-7rem)] xl:min-h-[calc(100svh-16rem)] xl:min-h-[calc(100dvh-16rem)]">
              <div className="flex flex-col items-start justify-center bg-white px-5 py-8 sm:px-8 md:px-10 lg:px-12 lg:py-14">
                <p className="relative z-10 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  {work.num} — {client}
                </p>
                <h1 className="relative z-10 mt-3 max-w-2xl text-3xl font-bold tracking-tight text-foreground/95 sm:text-4xl xl:text-5xl xl:leading-[1.08]">
                  <AuroraText colors={AURORA_COLORS} speed={1}>
                    {work.name}
                  </AuroraText>
                </h1>
                <p className="relative z-10 mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
                  {localizedBody}
                </p>
                {work.href && (
                  <div className="relative z-10 mt-6 flex w-full sm:w-auto">
                    <a
                      href={work.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full border-0 bg-[#4e6cb8] px-7 text-base text-white shadow-lg shadow-[#4e6cb8]/30 hover:bg-[#4e6cb8]/90 sm:w-auto"
                    >
                      {tWorks("visit")} {work.name}
                      <ArrowUpRight className="size-4" strokeWidth={1.75} />
                    </a>
                  </div>
                )}
              </div>
              <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[520px]">
                <Image
                  src={cover}
                  alt={`${work.name} — ${tWorks("projectCover")}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {(work.challenge || work.solution) && (
          <section
            id="story"
            aria-labelledby="story-heading"
            className="relative flex w-full max-w-full scroll-mt-[60px] flex-col items-center justify-center overflow-x-clip py-16 sm:py-20 md:scroll-mt-[72px]"
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-4 sm:gap-12 sm:px-5 xl:max-w-[88rem]">
              <h2
                id="story-heading"
                className="mx-auto max-w-4xl text-center text-3xl font-bold leading-[1.1] tracking-tight text-foreground text-balance sm:text-4xl"
              >
                {tWorks("challengeSolutionPrefix")}{" "}
                <AuroraText colors={AURORA_COLORS} speed={1}>
                  {tWorks("challengeSolutionHighlight")}
                </AuroraText>
              </h2>

              <WorkStoryCards
                challenge={localizedChallenge}
                solution={localizedSolution}
              />
            </div>
          </section>
        )}

        {work.metrics && work.metrics.length > 0 && (
          <section
            id="results"
            aria-labelledby="results-heading"
            className="relative flex w-full max-w-full scroll-mt-[60px] flex-col items-center justify-center overflow-x-clip py-16 sm:py-20 md:scroll-mt-[72px]"
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-4 sm:gap-12 sm:px-5 xl:max-w-[88rem]">
              <h2
                id="results-heading"
                className="mx-auto max-w-4xl text-center text-3xl font-bold leading-[1.1] tracking-tight text-foreground text-balance sm:text-4xl"
              >
                {tWorks("resultsPrefix")}{" "}
                <AuroraText colors={AURORA_COLORS} speed={1}>
                  {tWorks("resultsHighlight")}
                </AuroraText>
              </h2>

              <div className="w-full">
                <HoverEffect
                  items={localizedMetrics.map((m, i, arr) => ({
                    title: m.value,
                    description: m.label.replace(/\n/g, " "),
                    className:
                      i === arr.length - 1 ? "col-span-2" : undefined,
                  }))}
                  className="grid-cols-2 gap-0"
                />
              </div>
            </div>
          </section>
        )}

        {gallery.length > 0 && (
          <section aria-labelledby="gallery-heading" className="w-full">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 sm:gap-10 sm:px-5 xl:max-w-[88rem]">
              <h2
                id="gallery-heading"
                className="mx-auto max-w-4xl text-center text-3xl font-bold leading-[1.1] tracking-tight text-foreground text-balance sm:text-4xl"
              >
                {tWorks("galleryPrefix")}{" "}
                <AuroraText colors={AURORA_COLORS} speed={1}>
                  {tWorks("galleryHighlight")}
                </AuroraText>
              </h2>
              <div className="flex h-auto min-h-0 w-full flex-col items-center sm:h-auto md:h-[78svh] md:h-[78dvh] md:min-h-[30rem] lg:h-[72svh] lg:h-[72dvh] lg:min-h-0">
                <LayoutGrid
                  variant="split"
                  splitMobile="equal"
                  mobileScrollTarget={false}
                  enableExpand={false}
                  cards={gallery.slice(0, 3).map<LayoutGridCard>((src, index) => ({
                    id: `gallery-${index}`,
                    content: <></>,
                    thumbnail: src,
                    alt:
                      localizedShotLabels?.[index] ??
                      `${work.name} ${tWorks("screenshot")} ${index + 1}`,
                    href: work.href,
                    className: index === 0 ? "lg:row-span-2" : undefined,
                    overlay: (
                      <>
                        <p className="mt-2 text-lg font-medium tracking-tight text-white sm:text-xl">
                          {localizedShotLabels?.[index] ??
                            `${work.name} — ${tWorks("screenshot")} ${index + 1}`}
                        </p>
                        {work.href && (
                          <p className="mt-1 flex items-center gap-1 text-xs font-medium tracking-wide text-white/60 uppercase">
                            {tWorks("visitProject")}
                            <ArrowUpRight className="size-3" strokeWidth={2} />
                          </p>
                        )}
                      </>
                    ),
                  }))}
                />
              </div>
            </div>
          </section>
        )}

        <ContactCta locale={locale} />
      </main>
      <Footer locale={locale} />
      <ContactModal />
    </>
  );
}
