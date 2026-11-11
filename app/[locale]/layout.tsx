import type { Metadata, Viewport } from "next";
import {
  Inter,
  Space_Grotesk,
  Geist_Mono,
  IBM_Plex_Sans,
} from "next/font/google";
import "../globals.css";

import { SmoothScroll } from "@/components/smooth-scroll";
import { TrackingProvider } from "@/components/tracking-provider";
import { TrackedClicks } from "@/components/tracked-clicks";
import {
  siteDescription,
  siteName,
  siteOgDescription,
  siteOgTitle,
  siteTitle,
  siteUrl,
} from "@/lib/site";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const appSans = Inter({
  variable: "--font-app-sans",
  subsets: ["latin"],
  display: "swap",
});

const appHeading = Space_Grotesk({
  variable: "--font-app-heading",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appNav = IBM_Plex_Sans({
  variable: "--font-app-nav",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const OG_LOCALE_MAP: Record<string, string> = {
  ro: "ro_RO",
  ru: "ru_RU",
  en: "en_US",
  es: "es_ES",
  da: "da_DK",
  de: "de_DE",
  fr: "fr_FR",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}`])
  );

  return {
    metadataBase: new URL(siteUrl),
    applicationName: siteName,
    title: {
      default: t("title"),
      template: `%s — ${siteName}`,
    },
    description: t("description"),
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    category: "technology",
    formatDetection: {
      email: true,
      address: false,
      telephone: true,
    },
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      url: `${siteUrl}/${locale}`,
      siteName,
      locale: OG_LOCALE_MAP[locale] ?? "en_US",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Devalon — AI & Software Development Studio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [`${siteUrl}/opengraph-image`],
    },
    appleWebApp: {
      capable: true,
      title: siteName,
      statusBarStyle: "default",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#13161d" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      className={`${appSans.variable} ${appHeading.variable} ${geistMono.variable} ${appNav.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!document.cookie.match(/(?:^|; )device-locale=/)){var l=(navigator.language||'').split('-')[0];document.cookie='device-locale='+encodeURIComponent(l)+';path=/;max-age=31536000';}}catch(e){}`,
          }}
        />
        <link
          rel="alternate"
          type="text/plain"
          href={`${siteUrl}/llms.txt`}
          title="Devalon — machine-readable summary for LLMs"
        />
      </head>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body className="min-h-full flex flex-col overflow-x-hidden bg-gray-100">
          <SmoothScroll>{children}</SmoothScroll>
          <TrackingProvider />
          <TrackedClicks />
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
