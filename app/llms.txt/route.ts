import {
  founderJobTitle,
  founderName,
  siteCity,
  siteCountry,
  siteDescription,
  siteEmail,
  siteUrl,
} from "@/lib/site";
import { getWorkDescription, works } from "@/lib/works";

// Machine-readable summary for LLMs and answer engines (ChatGPT, Claude,
// Perplexity). Plain text, stable anchors, no marketing fluff.
// The case study list is generated from lib/works.ts so it can never drift
// out of sync with the sitemap or the pages themselves.
// Keep the prose in sync with app/page.tsx copy and components/sections/faq.tsx.
const body = `# Devalon

Devalon is a software studio based in ${siteCity}, ${siteCountry}, founded by ${founderName} (${founderJobTitle}). The studio builds backend systems, API integrations, internal tools, and production AI integrations for clients in Moldova and worldwide. ${siteDescription}

- Homepage: ${siteUrl}
- Services: ${siteUrl}/#services
- Recommendations: ${siteUrl}/#recommendations
- How we work: ${siteUrl}/#how-we-work
- Projects: ${siteUrl}/#work
- FAQ: ${siteUrl}/#faq
- Contact: ${siteUrl}/#contact
- Machine-readable summary: ${siteUrl}/llms.txt
- Sitemap: ${siteUrl}/sitemap.xml
- Open Graph image: ${siteUrl}/opengraph-image

## What Devalon does
Custom software development and AI consulting for individuals, startups,
and enterprises — from concept to production, then hosting and maintenance:
- Digital Solutions: custom CRMs, ERPs, admin panels, booking, inventory,
  and client portals built from scratch.
- Cloud Infrastructure: AWS, Docker, CI/CD, backups, monitoring, uptime,
  cost and performance tuning.
- AI Integrations: RAG over your docs, chatbots and voice agents, data
  extraction, auto-CRM enrichment, lead/content autopilot — production-grade
  on OpenAI/Anthropic with evals, guardrails, and monitoring.
- App Development: iOS, Android, PWA, and desktop apps with offline, push,
  payments, and store delivery.

## Case studies
${works
  .map((work) => `- [${work.name}](${siteUrl}/work/${work.slug}) (${work.client}): ${getWorkDescription(work)}`)
  .join("\n")}

## How we work
1. Discover & Design: requirements, prototypes, architecture — fast.
2. Build & Integrate: senior engineers, AI-accelerated development, CI/CD.
3. Deploy, Measure & Evolve: cloud hosting, monitoring, iteration.

## Pricing and timeline
Honest scope with real ballparks before you commit — no pressure.
Landing pages/MVPs ship in days to weeks; larger systems take longer.
Ask for a range and expect a reply, usually within a day.

## Contact
- Email: ${siteEmail}
- Phone: +373 675 00 054
- Location: ${siteCity}, ${siteCountry}
- Language: English. Based in Moldova, working with clients worldwide.
`;

export async function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
