import type { MetadataRoute } from "next"

import { siteUrl } from "@/lib/site"
import { SITE_LAST_UPDATED, getCoverSrc, works } from "@/lib/works"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...works.map((work) => ({
      url: `${siteUrl}/work/${work.slug}`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [`${siteUrl}${getCoverSrc(work)}`],
    })),
  ]
}
