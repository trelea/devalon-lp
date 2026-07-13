import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
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
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    locale: "en_US",
    title: "Devalon — Build your digital dreams",
    description:
      "Software & AI development and consulting for individuals, startups, and enterprises. We turn ideas into working software.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devalon — Build your digital dreams",
    description:
      "Software & AI development and consulting for individuals, startups, and enterprises.",
  },
};

export const viewport: Viewport = {
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
      className={`${appSans.variable} ${appHeading.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
