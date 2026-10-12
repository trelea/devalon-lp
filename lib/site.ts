// Single source of truth for site identity — metadata, robots, sitemap, and
// the manifest all read from here.
export const siteUrl = "https://devalon.dev"

export const siteName = "Devalon"

export const siteTitle = "Devalon — Software & AI development and consulting"

// Kept under ~155 chars so search snippets don't truncate mid-sentence.
export const siteDescription =
  "Devalon takes products from concept to production — custom web apps, AI integrations, and scalable backends. Honest scope, real ballparks, no pressure."

export const siteEmail = "contact@devalon.dev"

export const sitePhoneDisplay = "+373 675 00 054"

export const sitePhoneHref = "tel:+37367500054"

// Studio location, used in JSON-LD (Organization.address) and llms.txt.
// City + country only: a solo studio with no public premises should not
// publish a street address. addressCountry is ISO 3166-1 alpha-2, the
// form schema.org and Google's validator expect — not "Moldova".
export const siteCity = "Chișinău"

export const siteCountry = "Moldova"

export const siteCountryCode = "MD"

// GitHub is intentionally absent: no personal/org profile URL has been
// confirmed, and sameAs is an authoritative identity assertion in
// structured data. Add founderGithub here once one exists.
export const devalonGithub: string | undefined = undefined

// Founder identity for schema.org Person markup (see app/page.tsx).
export const founderName = "Marius Trelea"

export const founderJobTitle = "Founder & Software Engineer"

export const founderLinkedIn = "https://www.linkedin.com/in/trelea-marius"
