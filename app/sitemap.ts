import type { MetadataRoute } from "next"

import { siteUrl } from "@/lib/site"
import { getCoverSrc, works } from "@/lib/works"

const LAST_MODIFIED = "2026-09-29"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...works.map((work) => ({
      url: `${siteUrl}/work/${work.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [`${siteUrl}${getCoverSrc(work)}`],
    })),
  ]
}
