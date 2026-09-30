import type { Metadata, Viewport } from "next";
import {
  Inter,
  Space_Grotesk,
  Geist_Mono,
  IBM_Plex_Sans,
} from "next/font/google";
import "./globals.css";

import { SmoothScroll } from "@/components/smooth-scroll";
import { siteDescription, siteName, siteTitle, siteUrl } from "@/lib/site";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s — ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "software development",
    "AI development",
    "AI automation",
    "custom software",
    "web development",
    "app development",
    "software consulting",
    "software maintenance",
    "startups",
    "enterprise software",
  ],
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
    canonical: "/",
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
    url: siteUrl,
    siteName,
    locale: "en_US",
    title: "Devalon — Build your digital dreams",
    description:
      "Software & AI development and consulting for individuals, startups, and enterprises. From concept to production, shipped fast.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Devalon — Software & AI development and consulting. From concept to production, shipped fast.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Devalon — Build your digital dreams",
    description:
      "Software & AI development and consulting for individuals, startups, and enterprises.",
    images: [`${siteUrl}/opengraph-image`],
  },
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // brand surfaces: light page background / footer navy (see branding/)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#13161d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${appSans.variable} ${appHeading.variable} ${geistMono.variable} ${appNav.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-gray-100">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
