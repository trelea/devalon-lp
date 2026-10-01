"use client"

import * as React from "react"

import { ContactForm } from "@/components/contact-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

/**
 * Mounted once on the page; opens whenever any `<a href="…#contact">` is
 * clicked (hero button, navbar dock item, …). Without JS those links fall
 * back to scrolling to the inline form in the "Your project" slide, which
 * carries id="contact".
 */
export function ContactModal() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return
      const target = event.target as Element | null
      const anchor = target?.closest?.('a[href$="#contact"]')
      if (!anchor) return
      event.preventDefault()
      setOpen(true)
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        overlayClassName="z-[60] bg-black/60 supports-backdrop-filter:backdrop-blur-sm"
        className="dark z-[70] block max-h-[calc(100svh-2rem)] max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-xl overflow-y-auto rounded-[2rem] border border-border bg-card p-6 text-base text-foreground shadow-2xl shadow-black/40 ring-0 sm:rounded-[2.5rem] sm:max-w-xl sm:p-8"
      >
        <DialogTitle className="text-center text-2xl font-bold tracking-tight text-foreground">
          Tell us your idea
        </DialogTitle>
        <DialogDescription className="mx-auto mt-2 max-w-md text-center text-base leading-relaxed text-muted-foreground">
          Good, bad, or delusional — we&apos;ll tell you honestly what it
          takes to make it real.
        </DialogDescription>
        <ContactForm className="mt-6" />
      </DialogContent>
    </Dialog>
  )
}
