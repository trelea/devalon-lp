import type { MetadataRoute } from "next"

import { siteDescription, siteName } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    scope: "/",
    lang: "en",
    categories: ["business", "productivity"],
    display: "standalone",
    background_color: "#f8fafb",
    theme_color: "#13161d",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
