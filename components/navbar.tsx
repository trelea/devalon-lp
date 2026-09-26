"use client"

import Image from "next/image"
import {
  Blocks,
  CalendarDays,
  FolderGit2,
  Mail,
  Menu,
  MessageSquareQuote,
  Phone,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { NavLink } from "@/components/nav-link"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const links = [
  { title: "Services", href: "#services", icon: Blocks },
  { title: "Recommendations", href: "#recommendations", icon: MessageSquareQuote },
  { title: "Projects", href: "#work", icon: FolderGit2 },
]

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 translate-y-0 transform-gpu border-b border-border/60 bg-white/70 shadow-[0_6px_20px_-6px_rgba(15,23,42,0.18)] backdrop-blur-md will-change-transform [backface-visibility:hidden]">
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-5 xl:max-w-[88rem]">
        <NavLink
          href="#top"
          aria-label="Devalon — home"
          className="inline-flex items-center"
        >
          <Image
            src="/devalon-logos/dark-txt.svg"
            alt="Devalon"
            width={210}
            height={63}
            className="h-11 w-auto sm:h-12"
            preload
          />
        </NavLink>

        {/* desktop: 3 links centered */}
        <nav aria-label="Primary" className="hidden items-center gap-10 font-nav md:flex md:absolute md:left-1/2 md:-translate-x-1/2">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className="text-base font-normal tracking-wide text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="lg" className="hidden h-11 rounded-full border-0 bg-[#4e6cb8] px-6 font-nav text-base font-medium text-white shadow-lg shadow-[#4e6cb8]/30 hover:bg-[#4e6cb8]/90 md:inline-flex">
            <NavLink href="#contact">
              <CalendarDays className="size-5" />
              Get in touch
            </NavLink>
          </Button>

          {/* mobile: hamburger + sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden size-11"
                aria-label="Open menu"
              >
                <Menu className="size-7" strokeWidth={2} />
              </Button>
            </SheetTrigger>
          <SheetContent side="right" className="flex flex-col">
            <SheetHeader className="px-4 pb-2 pt-2 text-left">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetClose asChild>
                <NavLink href="#top" aria-label="Devalon — home" className="inline-flex items-center">
                  <Image
                    src="/devalon-logos/dark-txt.svg"
                    alt="Devalon"
                    width={140}
                    height={42}
                    className="h-9 w-auto"
                  />
                </NavLink>
              </SheetClose>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 font-nav">
              {links.map((link) => (
                <SheetClose key={link.href} asChild>
                  <NavLink
                    href={link.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <link.icon className="size-5 text-primary" />
                    {link.title}
                  </NavLink>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <NavLink
                  href="#contact"
                  className="mt-2 flex items-center gap-3 rounded-lg bg-primary px-3 py-2.5 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <CalendarDays className="size-5" />
                  Get in touch
                </NavLink>
              </SheetClose>
            </nav>
            {/* contact info — no heading, bigger like main items */}
            <div className="mt-auto border-t border-border px-4 pt-6 pb-4">
              <div className="flex flex-col gap-1">
                <a
                  href="mailto:hello@devalon.dev"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Mail className="size-5 text-primary" strokeWidth={1.75} />
                  hello@devalon.dev
                </a>
                <a
                  href="tel:+37367500054"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Phone className="size-5 text-primary" strokeWidth={1.75} />
                  +373 675 00 054
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  )
}
