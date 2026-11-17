"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Globe } from "lucide-react"

import { routing } from "@/i18n/routing"
import { usePathname, useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const LOCALE_LABELS: Record<string, string> = {
  ro: "Română",
  ru: "Русский",
  en: "English",
  es: "Español",
  da: "Dansk",
  de: "Deutsch",
  fr: "Français",
}

export default function LanguageSwitcher() {
  const t = useTranslations("Navbar")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const handleSelect = (nextLocale: string) => {
    if (nextLocale === locale) {
      setOpen(false)
      return
    }
    setOpen(false)
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-11"
          aria-label={t("language")}
          data-track="navbar_language"
          data-track-location="navbar"
        >
          <Globe className="size-7 text-[#7196E0]" strokeWidth={2} />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 sm:max-w-xl sm:p-10 lg:max-w-2xl">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-lg">{t("chooseLanguage")}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 [&>*:last-child]:col-start-1 [&>*:last-child]:sm:col-start-2 [&>*:last-child]:lg:col-start-auto" role="listbox" aria-label={t("chooseLanguage")}>
          {(routing.locales as readonly string[]).map((l) => {
            const isActive = l === locale
            return (
              <Button
                key={l}
                variant="ghost"
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(l)}
                data-track={`navbar_language_${l}`}
                data-track-location="navbar_language_dialog"
                className={cn(
                  "flex h-auto flex-col items-center gap-1 rounded-2xl px-3 py-7 sm:py-8",
                  isActive
                    ? "bg-[#7196E0]/12 hover:bg-[#7196E0]/15"
                    : "hover:bg-muted"
                )}
              >
                <span
                  className={cn(
                    "text-3xl font-semibold tracking-tight sm:text-4xl",
                    isActive ? "text-[#7196E0]" : "text-foreground"
                  )}
                >
                  {l.toUpperCase()}
                </span>
                <span className="text-sm text-muted-foreground/70">
                  {LOCALE_LABELS[l] ?? l}
                </span>
              </Button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
