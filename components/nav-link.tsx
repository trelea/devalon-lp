"use client"

import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react"

type NavLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  href: string
  onNavigate?: () => void
}

/**
 * In-page anchor link with a clean-URL guarantee: smooth-scrolls to the
 * target, then writes exactly one hash via history.replaceState — no
 * Next.js hash stacking (/#top#top), no history entry per click.
 * Falls back to native behavior for non-hash hrefs.
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  function NavLink({ href, onNavigate, onClick, ...rest }, ref) {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event)
      if (event.defaultPrevented || !href.startsWith("#") || href.length < 2)
        return
      let target: Element | null = null
      try {
        target = document.querySelector(href)
      } catch {
        return
      }
      if (!target) return
      event.preventDefault()
      const win = window as unknown as {
        __lenis?: {
          scrollTo: (
            target: string,
            options?: { offset?: number; duration?: number },
          ) => void
        }
      }
      if (win.__lenis) {
        // phone: was way too top (48+40=8px), need a bit more down — target ~44px gap vs 72px desktop
        const isMobile = window.matchMedia("(max-width: 768px)").matches
        const delay = isMobile ? 80 : 0
        const offset = isMobile && href === "#work" ? 16 : 0
        setTimeout(() => win.__lenis!.scrollTo(href, { offset, duration: 1.4 }), delay)
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      window.history.replaceState(null, "", href)
      onNavigate?.()
    }
    return <a {...rest} ref={ref} href={href} onClick={handleClick} />
  }
)
