// Single source of truth for site identity — metadata, robots, sitemap, and
// the manifest all read from here.
export const siteUrl = "https://devalon.dev"

export const siteName = "Devalon"

export const siteTitle = "Devalon — AI & Software Development Studio"

// Kept under ~155 chars so search snippets don't truncate mid-sentence.
export const siteDescription =
  "AI & software development studio building AI agents, custom software and scalable backends for startups and growing companies. From concept to production."

// Social/OG variants — deliberately shorter than siteDescription so they
// aren't truncated in link previews.
export const siteOgTitle = "Devalon — AI & Software Development"

export const siteOgDescription =
  "AI agents, custom software and consulting for startups and growing companies. From concept to production."

// Long-form positioning sentence, shared verbatim by the JSON-LD
// Organization.description and the opening line of /llms.txt so every
// source describes Devalon identically.
export const siteStudioDescription =
  "AI & software development studio based in Chișinău, Moldova, founded by Marius Trelea. Devalon builds AI agents, custom software and scalable backends for startups and growing companies in Europe and the US."

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

// Founder identity for schema.org Person markup (see app/page.tsx).
export const founderName = "Marius Trelea"

export const founderJobTitle = "Founder & Software Engineer"

// Marius's personal profile. Distinct from devalonLinkedIn below, which is the
// company page — Person.sameAs wants the person, Organization.sameAs wants the
// company. Don't merge these.
export const founderLinkedIn = "https://www.linkedin.com/in/trelea-marius"

// Company/brand social profiles. Used for the footer links and for
// Organization.sameAs, which lets search engines tie the schema.org entity to
// these profiles.
export const devalonLinkedIn = "https://www.linkedin.com/company/devalon-dev"

export const devalonFacebook =
  "https://www.facebook.com/profile.php?id=61595041843225"

export const devalonInstagram = "https://www.instagram.com/devalon.dev"

export const devalonX = "https://x.com/devalondev"

// Canonical list for Organization.sameAs — append here when adding a profile.
export const devalonSocials = [
  devalonLinkedIn,
  devalonFacebook,
  devalonInstagram,
  devalonX,
] as const
