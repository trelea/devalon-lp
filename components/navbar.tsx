import Image from "next/image"
import Link from "next/link"
import {
  Blocks,
  CalendarDays,
  FolderGit2,
  MessageSquareQuote,
} from "lucide-react"

import { NavChrome } from "@/components/nav-chrome"
import { FloatingDock } from "@/components/ui/floating-dock"

const items = [
  {
    title: "Services",
    href: "#services",
    icon: <Blocks className="size-full text-primary" />,
  },
  {
    title: "Recommendations",
    href: "#recommendations",
    icon: <MessageSquareQuote className="size-full text-primary" />,
  },
  {
    title: "Works & projects",
    href: "#work",
    icon: <FolderGit2 className="size-full text-primary" />,
  },
  { title: "sep-2", href: "#", icon: null, separator: true },
  {
    title: "Get in touch",
    href: "#contact",
    icon: <CalendarDays className="size-full text-primary-foreground" />,
    className: "bg-primary hover:bg-primary/90",
  },
]

export default function Navbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <NavChrome>
        <Link
          href="#top"
          aria-label="Devalon — home"
          className="pointer-events-auto inline-flex items-center"
        >
          <Image
            src="/devalon-logos/dark-txt.svg"
            alt="Devalon"
            width={220}
            height={66}
            className="h-9 w-auto sm:h-16"
            preload
          />
        </Link>

        <FloatingDock
          items={items}
          desktopClassName="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          mobileClassName="pointer-events-auto"
        />
      </NavChrome>
    </header>
  )
}
