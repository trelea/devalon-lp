import type { MetadataRoute } from "next"

import { siteUrl } from "@/lib/site"
import { SITE_LAST_UPDATED, getCoverSrc, works } from "@/lib/works"
import { routing } from "@/i18n/routing"

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    entries.push({
      url: `${siteUrl}/${locale}`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    });
    for (const work of works) {
      entries.push({
        url: `${siteUrl}/${locale}/work/${work.slug}`,
        lastModified: SITE_LAST_UPDATED,
        changeFrequency: "monthly",
        priority: 0.8,
        images: [`${siteUrl}${getCoverSrc(work)}`],
      });
    }
  }
  return entries;
}
