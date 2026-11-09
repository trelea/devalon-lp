"use client"

import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react"
import { useLocale } from "next-intl"

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
    const locale = useLocale();

    // Keep hash links on the current localized page.
    const effectiveHref =
      href.startsWith("/#") && href.length > 2
        ? `/${locale}${href.slice(1)}`
        : href;

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return

      // Handle localized root + hash links (e.g. "/en#services")
      if (
        effectiveHref.startsWith(`/${locale}#`) &&
        effectiveHref.length > `/${locale}`.length + 1
      ) {
        const hash = effectiveHref.slice(effectiveHref.indexOf("#"))
        const isOnRoot =
          window.location.pathname === `/${locale}` ||
          window.location.pathname === `/${locale}/` ||
          window.location.pathname === "/"

        if (isOnRoot) {
          event.preventDefault()
          let target: Element | null = null
          try {
            target = document.querySelector(hash)
          } catch {
            return
          }
          if (!target) return

          const win = window as unknown as {
            __lenis?: {
              scrollTo: (
                target: string,
                options?: { offset?: number; duration?: number },
              ) => void
            }
          }
          if (win.__lenis) {
            const isMobile = window.matchMedia("(max-width: 768px)").matches
            const delay = isMobile ? 80 : 0
            const offset = isMobile && hash === "#work" ? 16 : 0
            setTimeout(() => win.__lenis!.scrollTo(hash, { offset, duration: 1.4 }), delay)
          } else {
            target.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          window.history.replaceState(null, "", hash)
          onNavigate?.()
        }
        return
      }

      // Handle root + hash links (e.g., "/#services") for the default case
      if (effectiveHref.startsWith("/#") && effectiveHref.length > 2) {
        const hash = effectiveHref.slice(1)
        const isOnRoot = window.location.pathname === "/"

        if (isOnRoot) {
          event.preventDefault()
          let target: Element | null = null
          try {
            target = document.querySelector(hash)
          } catch {
            return
          }
          if (!target) return

          const win = window as unknown as {
            __lenis?: {
              scrollTo: (
                target: string,
                options?: { offset?: number; duration?: number },
              ) => void
            }
          }
          if (win.__lenis) {
            const isMobile = window.matchMedia("(max-width: 768px)").matches
            const delay = isMobile ? 80 : 0
            const offset = isMobile && hash === "#work" ? 16 : 0
            setTimeout(() => win.__lenis!.scrollTo(hash, { offset, duration: 1.4 }), delay)
          } else {
            target.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          window.history.replaceState(null, "", hash)
          onNavigate?.()
        }
        return
      }

      // Handle plain hash links (e.g., "#services")
      if (!effectiveHref.startsWith("#") || effectiveHref.length < 2) return
      let target: Element | null = null
      try {
        target = document.querySelector(effectiveHref)
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
        const isMobile = window.matchMedia("(max-width: 768px)").matches
        const delay = isMobile ? 80 : 0
        const offset = isMobile && effectiveHref === "#work" ? 16 : 0
        setTimeout(() => win.__lenis!.scrollTo(effectiveHref, { offset, duration: 1.4 }), delay)
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      window.history.replaceState(null, "", effectiveHref)
      onNavigate?.()
    }
    return <a {...rest} ref={ref} href={effectiveHref} onClick={handleClick} />
  }
)
