import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ContactModal } from "@/components/contact-modal";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { HowWeWork } from "@/components/sections/who-we-serve";
// import { TechStack } from "@/components/sections/tech-stack";
import { Works } from "@/components/sections/works";
import { Recommendations } from "@/components/sections/recommendations";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

// structured data for search engines: who Devalon is, how to reach it, and
// what this site is (see node_modules/next/dist/docs/01-app/02-guides/json-ld.md)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/icons/icon-512.png`,
      description: siteDescription,
      email: "hello@devalon.dev",
      telephone: "+373 675 00 054",
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: "hello@devalon.dev",
          telephone: "+373 675 00 054",
          availableLanguage: ["English"],
        },
      ],
      knowsAbout: [
        "custom software development",
        "AI automation and integration",
        "web and mobile application development",
        "software maintenance and support",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en",
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
        <Services />
        <section>
          <Recommendations />
          <section className="bg-[#a8c4f0] py-12 sm:py-16 lg:py-24 xl:py-32">
            <section className="flex flex-col rounded-[2rem] bg-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-12 sm:rounded-[3rem] sm:py-16 lg:rounded-[48px] lg:py-24 xl:rounded-[75px] xl:py-32">
              <HowWeWork />
            </section>
          </section>
          <div
            aria-hidden
            className="h-32 w-full bg-gradient-to-b from-[#a8c4f0] via-[#e6eef9] to-background sm:h-48 lg:h-56"
          />
          <Works />
        </section>
      </main>
      <Footer />
      <ContactModal />
    </>
  );
}
