import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { siteName, siteUrl } from "@/lib/site";
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
  return getWorkSlugs().map((slug) => ({ slug }));
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
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) return {};
  const description = getWorkDescription(work);
  const url = `/work/${work.slug}`;
  return {
    title: `${work.name} — ${work.client}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url: `${siteUrl}${url}`,
      siteName,
      title: `${work.name} — Devalon case study`,
      description,
      images: [
        {
          url: `${siteUrl}${url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${work.name} — ${work.client} case study by Devalon`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${work.name} — Devalon case study`,
      description,
      images: [
        {
          url: `${siteUrl}${url}/opengraph-image`,
          alt: `${work.name} — ${work.client} case study by Devalon`,
        },
      ],
    },
  };
}

// Case study page built from the same pieces as the homepage:
// white rounded hero card, dark service-style cards, pill CTAs,
/// metric cards, bento gallery and the dark closing CTA.
export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();
  const gallery = getGallerySrcs(work.slug);
  const cover = getCoverSrc(work);
  const { prev, next } = getPrevNextWork(work.slug);
  const pageUrl = `${siteUrl}/work/${work.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${pageUrl}#work`,
        name: work.name,
        description: work.body,
        url: pageUrl,
        image: [`${siteUrl}${cover}`],
        author: { "@id": `${siteUrl}/#organization` },
        isPartOf: { "@id": `${siteUrl}/#website` },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${work.name} — ${work.client}`,
        description: getWorkDescription(work),
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${pageUrl}#work` },
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Work",
            item: `${siteUrl}/#work`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: work.name,
            item: pageUrl,
          },
        ],
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
        {/* hero — same full-viewport white card as the homepage hero */}
        <section className="relative flex min-h-svh min-h-dvh w-full max-w-full flex-col pt-[72px] sm:pt-20 lg:h-svh lg:h-dvh">
          <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-3 py-4 sm:px-4 sm:py-6 md:px-5 md:py-8 lg:px-5 lg:py-6 xl:max-w-[88rem] xl:px-4 xl:py-6">
            <div className="grid w-full overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_45px_-20px_rgba(15,23,42,0.22)] sm:rounded-[2rem] lg:grid-cols-2 lg:rounded-[3rem] min-h-[calc(100svh-72px-2rem)] min-h-[calc(100dvh-72px-2rem)] sm:min-h-[calc(100svh-72px-3rem)] sm:min-h-[calc(100dvh-72px-3rem)] md:min-h-[calc(100svh-72px-4rem)] md:min-h-[calc(100dvh-72px-4rem)] lg:min-h-[calc(100svh-72px-7rem)] lg:min-h-[calc(100dvh-72px-7rem)] xl:min-h-[calc(100svh-16rem)] xl:min-h-[calc(100dvh-16rem)]">
              <div className="flex flex-col items-start justify-center bg-white px-5 py-8 sm:px-8 md:px-10 lg:px-12 lg:py-14">
                <p className="relative z-10 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  {work.num} — {work.client}
                </p>
                <h1 className="relative z-10 mt-3 max-w-2xl text-3xl font-bold tracking-tight text-foreground/95 sm:text-4xl xl:text-5xl xl:leading-[1.08]">
                  <AuroraText colors={AURORA_COLORS} speed={1}>
                    {work.name}
                  </AuroraText>
                </h1>
                <p className="relative z-10 mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
                  {work.body}
                </p>
                {work.href && (
                  <div className="relative z-10 mt-6 flex w-full sm:w-auto">
                    <a
                      href={work.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full border-0 bg-[#4e6cb8] px-7 text-base text-white shadow-lg shadow-[#4e6cb8]/30 hover:bg-[#4e6cb8]/90 sm:w-auto"
                    >
                      Visit {work.name}
                      <ArrowUpRight className="size-4" strokeWidth={1.75} />
                    </a>
                  </div>
                )}
              </div>
              <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[520px]">
                <Image
                  src={cover}
                  alt={`${work.name} — project cover`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* challenge & solution */}
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
                Challenge &amp;{" "}
                <AuroraText colors={AURORA_COLORS} speed={1}>
                  solution
                </AuroraText>
              </h2>

              <WorkStoryCards
                challenge={work.challenge}
                solution={work.solution}
              />
            </div>
          </section>
        )}

        {/* results — metrics */}
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
                Proven{" "}
                <AuroraText colors={AURORA_COLORS} speed={1}>
                  results
                </AuroraText>
              </h2>

              <div className="w-full">
                <HoverEffect
                  items={work.metrics.map((m, i, arr) => ({
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

        {/* gallery — bento grid, same layout as "How We Work" */}
        {gallery.length > 0 && (
          <section aria-labelledby="gallery-heading" className="w-full">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 sm:gap-10 sm:px-5 xl:max-w-[88rem]">
              <h2
                id="gallery-heading"
                className="mx-auto max-w-4xl text-center text-3xl font-bold leading-[1.1] tracking-tight text-foreground text-balance sm:text-4xl"
              >
                See it{" "}
                <AuroraText colors={AURORA_COLORS} speed={1}>
                  in action
                </AuroraText>
              </h2>
              <div className="flex h-auto min-h-0 w-full flex-col items-center sm:h-auto md:h-[78svh] md:h-[78dvh] md:min-h-[30rem] lg:h-[72svh] lg:h-[72dvh] lg:min-h-0">
                <LayoutGrid
                  variant="split"
                  splitMobile="equal"
                  mobileScrollTarget={false}
                  enableExpand={false}
                  cards={gallery.map<LayoutGridCard>((src, index) => ({
                    id: `gallery-${index}`,
                    content: <></>,
                    thumbnail: src,
                    alt:
                      work.shotLabels?.[index] ??
                      `${work.name} screenshot ${index + 1}`,
                    href: work.href,
                    className: index === 0 ? "lg:row-span-2" : undefined,
                    overlay: (
                      <>
                        <p className="mt-2 text-lg font-medium tracking-tight text-white sm:text-xl">
                          {work.shotLabels?.[index] ??
                            `${work.name} — screenshot ${index + 1}`}
                        </p>
                        {work.href && (
                          <p className="mt-1 flex items-center gap-1 text-xs font-medium tracking-wide text-white/60 uppercase">
                            Visit project
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

        <ContactCta />
      </main>
      <Footer />
      <ContactModal />
    </>
  );
}
