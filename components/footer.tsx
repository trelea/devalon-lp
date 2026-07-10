import Image from "next/image"
import Link from "next/link"
import {
  Code2,
  FolderOpen,
  Laptop,
  Layers,
  Mail,
  Phone,
  Quote,
  Users,
} from "lucide-react"
import { siFacebook, siInstagram, siX } from "simple-icons"

import { NeonHalfCircle } from "@/components/ui/neon-half-circle"

// LinkedIn was removed from simple-icons; inline its official mark.
const linkedin = {
  title: "LinkedIn",
  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
}

const sections = [
  { label: "Our services", href: "#services", icon: Code2 },
  { label: "Who we work with", href: "#who-we-serve", icon: Users },
  { label: "Recommendations", href: "#recommendations", icon: Quote },
  { label: "Tech stack", href: "#stack", icon: Layers },
  { label: "Works & projects", href: "#work", icon: FolderOpen },
]

const socials = [
  { label: "Instagram", href: "#", icon: siInstagram },
  { label: "Facebook", href: "#", icon: siFacebook },
  { label: "X", href: "#", icon: siX },
  { label: "LinkedIn", href: "#", icon: linkedin },
]

export default function Footer() {
  return (
    <footer className="dark relative isolate overflow-hidden border-t border-border bg-background bg-[linear-gradient(to_right,oklch(0.16_0.012_258),oklch(0.185_0.045_262))] text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_120%_at_80%_0%,rgba(113,150,224,0.10),transparent)]"
      />
      <NeonHalfCircle />
      <div className="mx-auto w-full max-w-7xl px-6 pt-14 pb-8 sm:px-8 xl:max-w-[88rem]">
        <div className="flex flex-col items-start justify-between gap-10 sm:flex-row">
          <div>
            <Link
              href="#top"
              className="inline-flex items-center"
              aria-label="Devalon home"
            >
              <Image
                src="/devalon-logos/light-txt.svg"
                alt="Devalon"
                width={220}
                height={66}
                className="h-14 w-auto sm:h-16"
              />
            </Link>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
              Software, tech &amp; AI development and consulting. We turn ideas
              into working software for individuals, startups, and enterprises.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="size-4 fill-current"
                  >
                    <path d={social.icon.path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-foreground">
              Explore
            </h4>
            <ul className="mt-3 space-y-2">
              {sections.map((section) => (
                <li key={section.href}>
                  <Link
                    href={section.href}
                    className="flex items-center gap-2.5 text-base text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <section.icon
                      className="size-4"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    {section.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-foreground">
              Get in touch
            </h4>
            <Link
              href="mailto:hello@devalon.dev"
              className="mt-3 flex items-center gap-2.5 text-base text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="size-4" strokeWidth={1.75} aria-hidden />
              hello@devalon.dev
            </Link>
            <Link
              href="tel:+37367500054"
              className="mt-2 flex items-center gap-2.5 text-base text-muted-foreground transition-colors hover:text-foreground"
            >
              <Phone className="size-4" strokeWidth={1.75} aria-hidden />
              +373 675 00 054
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-base text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Devalon. All rights reserved.</p>
          <p className="flex items-center gap-2 text-sm">
            Built by
            <span className="flex items-center gap-1.5">
              <Image
                src="/devalon-logos/light-txt.svg"
                alt="Devalon"
                width={150}
                height={45}
                className="h-7 w-auto"
              />
              <Laptop
                className="size-3.5 text-[oklch(0.55_0.11_262)]"
                strokeWidth={2.5}
                aria-hidden
              />
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
