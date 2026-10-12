import type { MetadataRoute } from "next"

import { siteUrl } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // AI crawlers / answer engines / assistants: same rules as "*".
      // Note we do NOT block /_next/ — Googlebot needs /_next/static to render
      // pages and /_next/image to discover images, and the AI bots read the
      // same assets. Bingbot/Applebot are search engines already covered by
      // "*"; listing them is explicit documentation, not a behavior change.
      {
        userAgent: [
          // OpenAI
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          // Anthropic
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "anthropic-ai",
          // Perplexity
          "PerplexityBot",
          "Perplexity-User",
          // Common Crawl (feeds many LLM indexes)
          "CCBot",
          // Search engines
          "Bingbot",
          "Google-Extended",
          "Applebot",
          "Applebot-Extended",
          // Assistants
          "DuckAssistBot",
          "Meta-ExternalAgent",
        ],
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
