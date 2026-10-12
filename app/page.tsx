import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ContactModal } from "@/components/contact-modal";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Services } from "@/components/sections/services";
import { Faq, faqs } from "@/components/sections/faq";
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
  siteDescription,
  siteEmail,
  siteName,
  siteStudioDescription,
  siteUrl,
} from "@/lib/site";
import { getWorkDescription, works } from "@/lib/works";

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
      description: siteStudioDescription,
      email: siteEmail,
      telephone: "+37367500054",
      // City + country only — no street address is published for the studio.
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
      // Devalon is a solo studio, so the company profile is the founder's —
      // but the brand now has its own pages, so sameAs lists those. The
      // founder's personal LinkedIn stays on the Person node below.
      sameAs: [...devalonSocials],
      founder: { "@id": `${siteUrl}/#founder` },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: siteEmail,
          telephone: "+37367500054",
          url: siteUrl,
          availableLanguage: ["English"],
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
      description: siteStudioDescription,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#service-ai-agents-automation`,
      name: "AI Agents & Automation",
      description:
        "AI agents that do real work inside your business: answering customers, extracting data from documents, enriching your CRM and automating repetitive workflows. Built on OpenAI and Anthropic models and plugged into the tools you already use, with evaluations, guardrails and monitoring so they're reliable in production, not just in demos.",
      provider: { "@id": `${siteUrl}/#organization` },
      serviceType: "AI agents and workflow automation",
      areaServed: "Worldwide",
      url: `${siteUrl}/#services`,
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#service-digital-solutions`,
      name: "Digital Solutions",
      description:
        "Custom CRMs, ERPs, admin panels, booking, inventory, and client portals — built from scratch around your operations.",
      provider: { "@id": `${siteUrl}/#organization` },
      serviceType: "Custom software development",
      areaServed: "Worldwide",
      url: `${siteUrl}/#services`,
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#service-cloud-infrastructure`,
      name: "Cloud Infrastructure",
      description:
        "AWS, Docker, CI/CD, backups, monitoring, and uptime — deployment and maintenance that keeps software alive and scaling.",
      provider: { "@id": `${siteUrl}/#organization` },
      serviceType: "Cloud infrastructure and maintenance",
      areaServed: "Worldwide",
      url: `${siteUrl}/#services`,
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#service-app-development`,
      name: "App Development",
      description:
        "iOS, Android, PWA, and desktop apps with offline support, push, payments, and store delivery — plus AI features inside the app.",
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
      inLanguage: "en-US",
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
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#work`,
      name: "Devalon case studies",
      url: `${siteUrl}/#work`,
      numberOfItems: works.length,
      itemListElement: works.map((work, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/work/${work.slug}`,
        name: work.name,
        description: getWorkDescription(work),
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="flex w-full flex-1 flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-24 xl:gap-32">
        <Hero />
        <Stats />
        <Services />
        <section>
          <Recommendations />
          <section className="bg-[#a8c4f0] py-12 sm:py-16 lg:py-24 xl:py-32">
            <section className="flex flex-col gap-28 rounded-[2rem] bg-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-12 sm:gap-0 sm:rounded-[3rem] sm:py-16 lg:rounded-[48px] lg:py-24 xl:rounded-[75px] xl:py-32">
              <HowWeWork />

              <Faq />
            </section>
          </section>
          <div
            aria-hidden
            className="h-32 w-full bg-gradient-to-b from-[#a8c4f0] via-[#e6eef9] to-background sm:h-48 lg:h-56"
          />
          <Works />
        </section>
      </main>
      <ContactCta />
      <Footer />
      <ContactModal />
    </>
  );
}
