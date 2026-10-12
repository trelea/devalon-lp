import {
  founderJobTitle,
  founderName,
  siteCity,
  siteCountry,
  siteEmail,
  siteStudioDescription,
  siteUrl,
} from "@/lib/site";
import { getWorkDescription, works } from "@/lib/works";

// Machine-readable summary for LLMs and answer engines (ChatGPT, Claude,
// Perplexity). Plain text, stable anchors, no marketing fluff.
// The opening paragraph is siteStudioDescription — the exact same sentence
// used as JSON-LD Organization.description, so every source describes
// Devalon identically. The case study list is generated from lib/works.ts
// so it can never drift from the sitemap or the pages themselves.
// Keep the prose in sync with app/page.tsx copy and components/sections/faq.tsx.
const body = `# Devalon

${siteStudioDescription}

Founded by ${founderName} (${founderJobTitle}). Based in ${siteCity}, ${siteCountry}, working with clients across Europe and the US.

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
AI & software development studio — from concept to production, then hosting
and maintenance:
- AI Agents & Automation: AI agents that do real work inside your business —
  answering customers, extracting data from documents, enriching your CRM
  and automating repetitive workflows. Built on OpenAI and Anthropic with
  evaluations, guardrails and monitoring.
- Digital Solutions: custom CRMs, ERPs, admin panels, booking, inventory,
  and client portals built from scratch.
- Cloud Infrastructure: AWS, Docker, CI/CD, backups, monitoring, uptime,
  cost and performance tuning.
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
