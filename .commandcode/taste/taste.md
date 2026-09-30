# Taste — devalon (Next.js / Tailwind project)

## Design & UI
- When adding a new section or page, reuse the existing design system instead of inventing new styles: match the same layout shell, spacing classes, container widths, heading styles, and card patterns already established on other pages (e.g. the root home page). Confidence: 0.8
- Strongly dislikes "card soup": sections composed of many separate boxes/cards read as poor UI/UX. Prefer consolidating related content into a single cohesive surface (with internal dividers/columns) rather than a stack of individual cards. Confidence: 0.8
- Expects section backgrounds to be visually consistent with the rest of the page — a new section must not paint a different background than surrounding sections (e.g. the hero). Don't hardcode a background color that differs from the page's; let sections inherit the page background unless there's an intentional design reason. Confidence: 0.8
