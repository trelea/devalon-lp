import { setRequestLocale, getTranslations } from "next-intl/server";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { SectionTrack } from "@/components/section-tracker";
import { ScrollDepthTracker } from "@/components/scroll-depth-tracker";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Services } from "@/components/sections/services";
import { Faq, getFaqs } from "@/components/sections/faq";
import { HowWeWork } from "@/components/sections/who-we-serve";
// import { TechStack } from "@/components/sections/tech-stack";
import { Works } from "@/components/sections/works";
import { Recommendations } from "@/components/sections/recommendations";
import { ContactCta } from "@/components/sections/contact-cta";
import {
  devalonSocials,
  founderJobTitle,
  founderLinkedIn,
  founderName,
  siteCity,
  siteCountry,
  siteCountryCode,
  siteEmail,
  siteName,
  siteUrl,
} from "@/lib/site";
import { getWorkDescription, works } from "@/lib/works";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqs = await getFaqs(locale);
  const tMeta = await getTranslations({ locale, namespace: "Metadata" });
  const tServices = await getTranslations({ locale, namespace: "Services" });

  // structured data for search engines: who Devalon is, how to reach it, and
  // what this site is (see node_modules/next/dist/docs/01-app/02-guides/json-ld.md)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        alternateName: "Devalon — AI & Software Development Studio",
        url: siteUrl,
        logo: `${siteUrl}/icons/icon-512.png`,
        description: tMeta("description"),
        email: siteEmail,
        telephone: "+37367500054",
        address: {
          "@type": "PostalAddress",
          addressLocality: siteCity,
          addressRegion: siteCity,
          addressCountry: siteCountryCode,
        },
        areaServed: [
          { "@type": "Place", name: "Europe" },
          { "@type": "Place", name: "United States" },
          { "@type": "Country", name: siteCountry },
        ],
        sameAs: [...devalonSocials],
        founder: { "@id": `${siteUrl}/#founder` },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            email: siteEmail,
            telephone: "+37367500054",
            url: siteUrl,
            availableLanguage: ["English", "Romanian", "Russian", "Spanish", "Danish", "German", "French"],
          },
        ],
        knowsAbout: [
          "AI agents",
          "Software development",
          "Backend development",
          "API integrations",
          "Cloud infrastructure",
        ],
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#founder`,
        name: founderName,
        jobTitle: founderJobTitle,
        url: siteUrl,
        worksFor: { "@id": `${siteUrl}/#organization` },
        knowsAbout: [
          "AI agents",
          "Software development",
          "Backend development",
          "API integrations",
          "Cloud infrastructure",
        ],
        sameAs: [founderLinkedIn],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        description: tMeta("description"),
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: locale,
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: siteName,
        description: tMeta("description"),
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
        inLanguage: locale,
      },
      {
        "@type": "Service",
        "@id": `${siteUrl}/#service-ai-agents-automation`,
        name: tServices("items.aiAgents.title"),
        description: tServices("items.aiAgents.description"),
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: "AI agents and workflow automation",
        areaServed: "Worldwide",
        url: `${siteUrl}/#services`,
      },
      {
        "@type": "Service",
        "@id": `${siteUrl}/#service-digital-solutions`,
        name: tServices("items.digitalSolutions.title"),
        description: tServices("items.digitalSolutions.description"),
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: "Custom software development",
        areaServed: "Worldwide",
        url: `${siteUrl}/#services`,
      },
      {
        "@type": "Service",
        "@id": `${siteUrl}/#service-cloud-infrastructure`,
        name: tServices("items.cloudInfrastructure.title"),
        description: tServices("items.cloudInfrastructure.description"),
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: "Cloud infrastructure and maintenance",
        areaServed: "Worldwide",
        url: `${siteUrl}/#services`,
      },
      {
        "@type": "Service",
        "@id": `${siteUrl}/#service-app-development`,
        name: tServices("items.appDevelopment.title"),
        description: tServices("items.appDevelopment.description"),
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: "Mobile and desktop app development",
        areaServed: "Worldwide",
        url: `${siteUrl}/#services`,
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        url: `${siteUrl}/#faq`,
        isPartOf: { "@id": `${siteUrl}/#webpage` },
        inLanguage: locale,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: [
              faq.answer,
              ...(faq.points ?? []),
              ...(faq.cta ? [faq.cta.label] : []),
            ].join(" "),
          },
        })),
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
      <ScrollDepthTracker />
      <main className="flex w-full flex-1 flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-24 xl:gap-32">
        <SectionTrack name="hero">
          <Hero locale={locale} />
        </SectionTrack>
        <SectionTrack name="stats">
          <Stats locale={locale} />
        </SectionTrack>
        <SectionTrack name="services">
          <Services locale={locale} />
        </SectionTrack>
        <section>
          <SectionTrack name="recommendations">
            <Recommendations locale={locale} />
          </SectionTrack>
          <section className="bg-[#a8c4f0] py-12 sm:py-16 lg:py-24 xl:py-32">
            <section className="flex flex-col gap-28 rounded-[2rem] bg-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-12 sm:gap-0 sm:rounded-[3rem] sm:py-16 lg:rounded-[48px] lg:py-24 xl:rounded-[75px] xl:py-32">
              <SectionTrack name="how-we-work">
                <HowWeWork />
              </SectionTrack>

              <SectionTrack name="faq">
                <Faq locale={locale} />
              </SectionTrack>
            </section>
          </section>
          <div
            aria-hidden
            className="h-32 w-full bg-gradient-to-b from-[#a8c4f0] via-[#e6eef9] to-background sm:h-48 lg:h-56"
          />
          <SectionTrack name="works">
            <Works locale={locale} />
          </SectionTrack>
        </section>
      </main>
      <SectionTrack name="contact-cta">
        <ContactCta locale={locale} />
      </SectionTrack>
      <Footer locale={locale} />
    </>
  );
}
