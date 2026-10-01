// Single source of truth for case studies — pure data, no node:fs.
// Server-only image listing lives in components/sections/works.tsx and
// app/work/[slug]/page.tsx (both Server Components).
export type Work = {
  num: string;
  client: string;
  name: string;
  href?: string;
  slug: string;
  shotLabels?: string[];
  body: string;
  challenge?: string;
  solution?: string;
  highlights?: string[];
  metrics?: { value: string; label: string }[];
};

// Bump when work entries or site copy change — feeds sitemap lastModified.
export const SITE_LAST_UPDATED = "2026-10-01";

// 3 big squares remain 2Marketing (big right top idx2), WHM (big left middle idx3), Palazzo (big right bottom idx8)
// 6 small reordered as requested: Red Core → Dialog Imobil → Premier Invest → Dialog Invest → Bundller → Eta
// flat order: [redcore, dialogimobil, 2marketing, wynne, premierinvest, dialoginvest, megawind, etatruck, palazzo]
// chunk0: [redcore, dialogimobil, 2marketing] → tall=2marketing
// chunk1: [wynne, premierinvest, dialoginvest] → tall=wynne
// chunk2: [megawind, etatruck, palazzo] → tall=palazzo
export const works: Work[] = [
  {
    num: "08",
    slug: "redcore",
    shotLabels: [
      "Lead-gen site",
      "CMS — project media",
      "Same-day quote CTA",
    ],
    client: "Local business · USA",
    name: "Red Core Concrete",
    href: "https://redcoreconcrete.com",
    body: "Red Core is a Massachusetts-based concrete cutting expert helping contractors, developers, and property owners get precise, clean, and reliable results across core drilling, slab cutting, wall sawing, demolition, and concrete restoration, delivering a modern, conversion-focused digital experience that turns everyday website visitors into qualified leads and booked jobs while building long-term trust through transparent pricing, proven project results, and always-available service.",
    challenge:
      "Before the transformation, the business was losing valuable opportunities due to a fragmented customer journey, slow and cumbersome quote requests, limited visibility of services and special offers, inconsistent presentation of past work, and a poor mobile experience that frustrated busy decision-makers, leading to missed inquiries, low conversion rates, manual follow-up overhead, and difficulty standing out in a competitive local market despite strong field expertise and reputation.",
    solution:
      "The new solution created a seamless, customer-first experience that makes it effortless to discover services, explore real project examples, view compelling offers, and request a same-day quote in seconds with photo uploads and flexible callback scheduling, ensuring every inquiry is captured instantly across desktop and mobile, guiding prospects smoothly from interest to action, strengthening credibility, and freeing the team to focus on delivering exceptional work rather than chasing leads.",
    highlights: [
      "Converts organic traffic into quote inquiries by giving each core service dedicated landing pages and visual proof galleries.",
      "Integrated a custom media CMS enabling the owner to upload project photos and job logs directly from the field.",
    ],
    metrics: [
      { value: "x3", label: "increase in\nqualified leads" },
      { value: "+68%", label: "faster quote\nturnaround" },
      { value: "+45%", label: "higher conversion\nrate" },
      { value: "+70%", label: "growth in mobile\nengagement" },
      { value: "-95%", label: "reduction in missed\ninquiries" },
    ],
  },
  {
    num: "04",
    slug: "dialogimobil",
    shotLabels: ["Listings platform", "Mobile property page", "Admin login"],
    client: "Real estate · Chișinău",
    name: "Dialog Imobil",
    href: "https://dialogimobil.md",
    body: "Dialog Imobil is a high-converting real estate platform that turns every property into a lead-generating opportunity, seamlessly connecting a full portfolio of apartments, houses, commercial spaces, land and garages with serious buyers and tenants through a beautifully curated, multilingual showcase and an integrated client engagement engine, delivering sustained growth, stronger brand authority and measurable commercial success for a forward-thinking agency operating in a highly competitive property market.",
    challenge:
      "The agency was held back by fragmented and manual property operations, slow and inconsistent listing updates across multiple property types, limited visibility for high-value offers, frustrating search experiences for buyers unable to filter by real needs, lack of control over who could manage and publish sensitive listings, and no unified way to nurture inquiries, build trust through team and service storytelling, or convert casual browsing into qualified leads at scale.",
    solution:
      "Dialog Imobil delivered a unified business solution that centralizes all portfolio management in one intuitive hub while empowering buyers with a fast, elegant, and highly personalized discovery experience featuring smart filters, interactive location exploration, hot offers, mortgage guidance and rich storytelling around services, team expertise and trust, supported by secure agent workflows, private and public listing controls, effortless multilingual content management and optimized media delivery that makes publishing effortless, keeps every listing accurate and on-brand, and guides every visitor naturally from interest to inquiry to closed deal.",
    highlights: [
      "Built a custom back-office dashboard allowing agents to update properties, hot offers, and articles in real time without technical help.",
      "Streamlined buyer navigation with interactive maps, filterable property categories, and direct contact forms.",
    ],
    metrics: [
      { value: "+70%", label: "faster property\npublishing" },
      { value: "x3", label: "increase in\nqualified leads" },
      { value: "-60%", label: "reduction in admin\nworkload" },
      { value: "+45%", label: "higher buyer\nengagement" },
      { value: "+85%", label: "faster browsing\nexperience" },
    ],
  },
  {
    num: "01",
    slug: "2marketing",
    shotLabels: ["Mobile app", "Landing page", "Admin dashboard"],
    client: "AI SaaS · Denmark",
    name: "2Marketing",
    href: "https://2marketing.ai",
    body: "2Marketing is the complete AI-powered marketing operating system that transforms how small and medium businesses grow, unifying automated content creation, intelligent media management, high-converting landing pages and reliable cross-platform publishing into one seamless platform that delivers agency-quality marketing at a fraction of the cost, time and effort while helping customers cut costs in half, double conversions and stay perfectly on brand across every channel.",
    challenge:
      "Growing businesses were trapped in a fragmented and expensive marketing reality, juggling disconnected tools for ideas, assets, campaigns and publishing, relying on costly agencies or endless manual work, struggling with untagged media libraries, inconsistent branding, missed schedules, failed uploads and weak landing page copy that wasted budget, drained teams and made predictable growth impossible to achieve or scale.",
    solution:
      "2Marketing replaces the chaos with one intelligent, always-on platform that automatically creates a full month of on-brand ideas from each customer's own content, instantly organizes and perfects thousands of images and videos with AI that preserves faces and messaging, crafts landing page copy that rivals human experts, validates and publishes flawlessly across Meta, Instagram, Facebook, LinkedIn, Google and Reddit with built-in recovery and synchronization, and is orchestrated through a single command center with an always-on AI teammate that remembers every customer and handles the heavy lifting so businesses market faster, smarter and with total confidence.",
    highlights: [
      "Built for scale: Reliably processes 100,000+ automated posts and ad updates monthly with automated error recovery.",
      "Saves 15+ hours weekly per business by replacing manual ad management with streamlined 1-click publishing.",
    ],
    metrics: [
      { value: "+50%", label: "marketing cost\nsavings" },
      { value: "x2", label: "higher conversion\nrates" },
      { value: "+90%", label: "time saved on\nmarketing" },
      { value: "+95%", label: "publishing and\ncampaign success" },
      { value: "+99.9%", label: "reliable automated\ndelivery" },
    ],
  },
  {
    num: "02",
    slug: "wynne",
    client: "Web app · USA",
    name: "Wynne Home Manager",
    href: "https://app.wynnehomemanager.com/",
    body: "Wynne Home Manager is a premium membership-based home management platform designed for discerning homeowners to protect, preserve, and enhance the long-term value of their properties through personalized maintenance plans, dedicated advisor guidance, and proactive property care, delivering complete peace of mind, preventing costly repairs, and transforming homeownership from reactive upkeep into strategic asset management while driving exceptional client satisfaction, loyalty, and recurring revenue growth.",
    challenge:
      "Before Wynne, homeowners and advisors faced constant friction from fragmented and manual property care, with missed seasonal maintenance leading to expensive emergency repairs, inconsistent communication and scheduling causing delays and confusion, complex and opaque onboarding and pricing frustrating new clients and slowing conversion, and no centralized visibility into home health, upcoming tasks, or property history making it impossible to stay proactive, protect investment value, or deliver scalable white-glove service efficiently.",
    solution:
      "Wynne Home Manager eliminates this friction with a seamless, guided experience that starts with an intuitive property survey and square-footage-based membership plan, moves effortlessly through integrated walkthrough scheduling and expert advisor matching, and sustains value through a centralized home health dashboard, automated personalized maintenance calendars, proactive reminders, overdue alerts and weather safeguards, and streamlined payments and document management, empowering clients to manage their entire property effortlessly while enabling advisors to deliver exceptional service at scale, deepen relationships, and accelerate business growth with ease and efficiency.",
    highlights: [
      "Intuitive property survey and square-footage-based membership with integrated walkthrough scheduling and expert advisor matching.",
      "Centralized home health dashboard with automated maintenance calendars, proactive reminders, weather safeguards, payments and document management.",
    ],
    metrics: [
      { value: "-70%", label: "onboarding\ntime" },
      { value: "+95%", label: "on-time\ncompletion" },
      { value: "-60%", label: "operational\ncosts" },
      { value: "x3", label: "advisor\nproductivity" },
      { value: "+85%", label: "client\nretention" },
    ],
  },
  {
    num: "05",
    slug: "premierinvest",
    shotLabels: ["Listings platform", "Property page", "Mobile search"],
    client: "Real estate · Chișinău",
    name: "Premier Invest",
    href: "https://primeinvest.md",
    body: "Premier Imobil is Chisinau's leading all-in-one real estate marketplace bringing together apartments, houses, commercial spaces and land for sale and rent in one trusted destination, empowering buyers, sellers and renters to discover, compare and connect with confidence through an engaging multilingual experience that turns high-intent browsing into booked viewings while driving sustained growth in leads, listings and customer loyalty.",
    challenge:
      "Before the transformation Premier Imobil struggled with fragmented property visibility, slow manual listing workflows, overwhelming and unfocused search experiences, language barriers for a diverse local and international audience and disconnected communication between clients and agents, leading to frustrated buyers unable to find relevant properties quickly, missed high-value inquiries, prolonged time on market, heavy administrative burden on the team and an inconsistent customer journey that limited lead generation, conversion and competitive differentiation in a crowded market.",
    solution:
      "We created a unified, customer-centric marketplace that makes property discovery effortless and action-oriented, offering intuitive category navigation, powerful smart filtering, interactive map-based location discovery, personalized favourites and instant direct connection to dedicated agents, all fully optimized for mobile and seamlessly available in Romanian, Russian and English, enabling Premier Imobil to publish new opportunities faster, keep buyers engaged longer, capture significantly more qualified inquiries and guide every client smoothly from first search to final viewing while drastically reducing operational effort and elevating brand trust and perceived value.",
    highlights: [
      "Intuitive category navigation with smart filtering, map-based discovery, favourites and instant direct agent connection.",
      "Fully optimized for mobile and trilingual RO/RU/EN with faster publishing and longer buyer engagement.",
    ],
    metrics: [
      { value: "+180%", label: "qualified buyer\ninquiries" },
      { value: "+65%", label: "property listing\nengagement" },
      { value: "-55%", label: "avg property\nsearch time" },
      { value: "-70%", label: "manual listing\nmanagement effort" },
      { value: "x3", label: "inquiry-to-viewing\nconversion speed" },
    ],
  },
  {
    num: "06",
    slug: "dialoginvest",
    shotLabels: ["Investor landing", "Key advantages", "Mobile offers"],
    client: "Investments · Romania",
    name: "Dialog Invest",
    href: "https://dialoginvest.md",
    body: "Dialog Invest is Romania's exclusive gateway for international investors seeking secure, high-yield entry into the European Union market through verified off-market commercial real estate and turnkey profitable businesses, delivering immediate passive income, strategic capital growth and fully managed ownership without the risks of public listings, empowering clients to build stable euro-denominated portfolios with trusted local expertise, transparent transactions and long-term partnership at every step.",
    challenge:
      "International investors eager to enter the EU market were held back by inflated Western European prices, overcrowded and unreliable public listings, complex legal and tax requirements, language barriers and a complete lack of trusted on-the-ground partners, leaving them exposed to risky deals, endless due diligence, slow and stressful market entry, uncertain profitability and missed opportunities for stable long-term growth.",
    solution:
      "Dialog Invest removes every barrier by providing exclusive access to vetted off-market properties and operating businesses precisely tailored to each investor's budget and strategy, combining deep financial analytics, risk assessment and ROI forecasting with full legal protection from licensed Romanian lawyers, transparent transaction support and complete business setup including company registration, banking and tax consulting plus optional remote management, turning a complex cross-border investment into a fast, secure and effortlessly profitable experience that generates returns from day one.",
    highlights: [
      "Exclusive access to vetted off-market properties and turnkey businesses tailored to each investor's budget and strategy.",
      "Deep analytics, risk assessment and ROI forecasting with full legal protection, business setup and optional remote management.",
    ],
    metrics: [
      { value: "+7.6%", label: "annual passive\nyield in euros" },
      { value: "+30%", label: "capital growth\nin 12-24 months" },
      { value: "x3", label: "lower acquisition\ncosts vs W. Europe" },
      { value: "+48%", label: "net profit on resale\nin 14 months" },
      { value: "-70%", label: "faster time to\nverified EU asset" },
    ],
  },
  {
    num: "03",
    slug: "megawind",
    shotLabels: [
      "Solo Trans Energy — solar B2B grid",
      "Eximius — hybrid solar + wind PPA",
      "Megawind — wind parks & ESG",
      "Importex Energy — logistics → wind",
    ],
    client: "Green Tech · EU",
    name: "Solar Grants Hub — 7 Brands, One System",
    href: "https://www.megawind.md",
    body: "We helped seven local customers turn a single reusable landing template into seven branded lead-generation engines to apply for EU green-tech grants — launching Solo Trans Energy, Eximius, Megawind, Importex Energy, Wind Rise, More Power and Nano Wind from one centralized CMS, each with its own identity, audience and Romanian/Russian content, built to capture high-intent leads fast and stay grant-ready.",
    challenge:
      "Before the system each brand needed a one-off landing, with slow bespoke builds, inconsistent grant readiness, duplicated effort across seven codebases, no per-brand CMS control and fragmented Romanian/Russian content that made rapid EU grant applications impossible to scale.",
    solution:
      "We delivered one high-performance template and centralized management architecture that launches seven branded landings from a single codebase — Solo Trans Energy (solotransenergy.md), Eximius (eximius.md), Megawind (megawind.md), Importex Energy (importexenergy.md), Wind Rise (windrise.md), More Power (morepower.md) and Nano Wind (nanowind.md) — each with independent CMS workspaces, localized RO/RU content, products and news, grant-ready performance and consistent identity.",
    highlights: [
      "Seven branded landings from one system — Solo Trans Energy, Eximius, Megawind, Importex Energy, Wind Rise, More Power, Nano Wind (RO/RU, solotransenergy.md / eximius.md / megawind.md / importexenergy.md / windrise.md / morepower.md / nanowind.md).",
      "One template, seven independent CMS workspaces — each brand controls its own localized content and grant-ready pages without developer help.",
    ],
    metrics: [
      { value: "7", label: "branded landings\none system" },
      { value: "EU", label: "grant-ready\nRO/RU landings" },
      { value: "x5", label: "faster brand\nrollout" },
      { value: "100%", label: "independent\ncontent control" },
      { value: "24/7", label: "multi-brand\nuptime" },
    ],
  },
  {
    num: "07",
    slug: "etatruck",
    shotLabels: ["Corporate site", "Fleet gallery", "Mobile — EU network"],
    client: "Logistics · EU",
    name: "ETA Truck",
    href: "https://eta-truck.ro",
    body: "The custom ETA Truck landing page was designed and built as a high-performance B2B lead generation engine to establish market trust and convert European freight prospects into active inquiries. By focusing on persuasive visual hierarchy, clear service segmentation, and frictionless quote request flows, the platform elevates brand credibility and systematically captures high-value B2B logistics clients online.",
    challenge:
      "ETA Truck previously suffered from limited digital visibility and an unoptimized online presence that failed to effectively communicate their specialized heavy-haul capabilities or convert visiting prospects. Prospective clients found it difficult to quickly evaluate service tiers, check international coverage, or request custom quotes, resulting in high bounce rates and lost B2B revenue opportunities.",
    solution:
      "We developed a streamlined, fully responsive marketing landing page built for speed, immediate clarity, and maximum lead conversion. By organizing complex logistics offerings into clear visual categories, integrating interactive quote calls-to-action, highlighting social proof, and optimizing multilingual accessibility across European markets, the platform turns digital traffic into a consistent stream of qualified logistics leads.",
    highlights: [
      "Persuasive visual hierarchy with clear service segmentation and frictionless quote request flows.",
      "Fully responsive, speed-optimized landing with interactive CTAs, social proof and multilingual accessibility.",
    ],
    metrics: [
      { value: "+65%", label: "visitor-to-lead\nconversion rate" },
      { value: "-50%", label: "bounce\nrate" },
      { value: "x3", label: "quote request\nvolume" },
      { value: "+85%", label: "mobile user\nengagement" },
      { value: "-70%", label: "page load\ntime" },
    ],
  },
  {
    num: "09",
    slug: "palazzo",
    shotLabels: ["Clinic site", "Mobile booking", "Online appointments"],
    client: "Wellness · Chișinău",
    name: "Palazzo Aesthetics",
    href: "https://palazzoaesthetics.md/",
    body: "Palazzo Aesthetics is a boutique wellness clinic in Chisinau specializing in phyto-aesthetics and phytotherapy, blending over 65 years of botanical expertise with modern science to deliver natural, visible results for skin, body and wellbeing. To transform its strong local reputation into predictable growth, Palazzo partnered with us to launch a premium, multilingual digital platform that attracts high-intent clients, builds instant trust and converts interest into booked appointments around the clock.",
    challenge:
      "Before the new platform, Palazzo relied on fragmented manual processes to manage demand, with appointment requests scattered across Instagram messages, phone calls and in-person enquiries that were slow to handle, easy to miss and impossible to track outside working hours. The clinic lacked a central, professional online presence to clearly explain its two core services, reassure discerning clients and serve Romanian, Russian and English speakers equally, causing high-intent visitors to drop off and choose competitors with simpler booking. Content and promotion updates required external help and took too long, the business was nearly invisible in organic search, and valuable clinical time was lost to repetitive administration instead of care, follow-up and growth.",
    solution:
      "We delivered an elegant, conversion-focused website that makes discovering, trusting and booking Palazzo effortless on any device and in any language, with clear journeys for phyto-aesthetics and phytotherapy, compelling proof points and one-click appointment scheduling that captures and qualifies every lead instantly even after hours. An intuitive content hub now lets the team publish news, update services and share promotions in minutes without technical support, while integrated contact flows ensure no enquiry is lost and every prospect receives a prompt, professional response. Designed for discovery and trust from the first impression, the platform guides visitors naturally from inspiration to action, dramatically reduces administrative friction, shortens the decision cycle and creates a seamless client experience that consistently turns interest into confirmed appointments, revenue and long-term advocacy.",
    highlights: [
      "Elegant conversion-focused journeys for phyto-aesthetics and phytotherapy with one-click scheduling that captures every lead after hours.",
      "Intuitive content hub for news, services and promotions with integrated contact flows and prompt professional response.",
    ],
    metrics: [
      { value: "+240%", label: "growth in qualified\ninbound leads" },
      { value: "+68%", label: "online booking\nconversion rate" },
      { value: "-75%", label: "manual appointment\nhandling time" },
      { value: "+190%", label: "increase in organic\nsearch visibility" },
      { value: "x3", label: "monthly booked\nappointments" },
    ],
  },
];

export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((work) => work.slug === slug);
}

export function getWorkSlugs(): string[] {
  return works.map((work) => work.slug);
}

export function getCoverSrc(work: Pick<Work, "slug">): string {
  return `/works/${work.slug}/cover.webp`;
}

export function getWorkUrl(work: Pick<Work, "slug">): string {
  return `/work/${work.slug}`;
}

export function getPrevNextWork(slug: string): {
  prev: Work | undefined;
  next: Work | undefined;
} {
  const index = works.findIndex((work) => work.slug === slug);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: works[(index - 1 + works.length) % works.length],
    next: works[(index + 1) % works.length],
  };
}

export function getWorkDescription(work: Work, maxLength = 155): string {
  const text = work.body.replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}
