"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowUpRight,
  Check,
  Lightbulb,
  LoaderCircle,
  Mail,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneNumberInput } from "@/components/ui/phone-number-input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Status = "idle" | "sending" | "sent"

function LabelInputContainer({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  )
}

// minimal underline fields: no box, no visible label — an icon, a descriptive
// placeholder, and a bottom border that turns primary on focus
const fieldClasses =
  "peer h-12 rounded-none border-0 border-b border-border bg-transparent pr-0 pl-7 shadow-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-0 md:text-base dark:bg-transparent"

// icon sits on the underline's left edge and follows the focus color
const fieldIconClasses =
  "pointer-events-none absolute left-0 size-4 text-muted-foreground/70 transition-colors peer-focus:text-primary"

export function ContactForm({ className }: { className?: string }) {
  const [status, setStatus] = React.useState<Status>("idle")
  // unique per instance — the form renders both inline and inside the modal
  const uid = React.useId()
  const fieldId = (name: string) => `contact-${name}${uid}`

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status !== "idle") return
    setStatus("sending")
    // TODO: wire real delivery (e.g. a Resend server action) — UI-only for now
    await new Promise((resolve) => setTimeout(resolve, 900))
    setStatus("sent")
  }

  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex min-h-80 flex-col items-center justify-center py-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
              className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <Check className="size-7" strokeWidth={2.5} />
            </motion.div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
              Idea received.
            </h3>
            <p className="mt-2 max-w-sm text-base leading-relaxed text-muted-foreground">
              We&apos;ll read it and answer honestly — usually within a day. No
              pressure, no spam.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setStatus("idle")}
            >
              Send another idea
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-7 sm:flex-row sm:gap-5">
              <LabelInputContainer>
                <Label htmlFor={fieldId("name")} className="sr-only">
                  Full name
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id={fieldId("name")}
                    name="name"
                    type="text"
                    placeholder="Full name"
                    autoComplete="name"
                    required
                    className={fieldClasses}
                  />
                  <User className={fieldIconClasses} strokeWidth={1.75} aria-hidden />
                </div>
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor={fieldId("email")} className="sr-only">
                  Email
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id={fieldId("email")}
                    name="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    required
                    className={fieldClasses}
                  />
                  <Mail className={fieldIconClasses} strokeWidth={1.75} aria-hidden />
                </div>
              </LabelInputContainer>
            </div>
            <LabelInputContainer className="mt-7">
              <Label htmlFor={fieldId("phone")} className="sr-only">
                Phone number (optional)
              </Label>
              <PhoneNumberInput
                id={fieldId("phone")}
                inputClassName={cn(fieldClasses, "border-0 pl-2")}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mt-7">
              <Label htmlFor={fieldId("idea")} className="sr-only">
                Your idea
              </Label>
              <div className="relative">
                <Textarea
                  id={fieldId("idea")}
                  name="idea"
                  placeholder="Describe your project — goals, scope, and timeline"
                  required
                  rows={6}
                  className={cn(fieldClasses, "h-auto min-h-40 py-3")}
                />
                <Lightbulb
                  className={cn(fieldIconClasses, "top-3.5")}
                  strokeWidth={1.75}
                  aria-hidden
                />
              </div>
            </LabelInputContainer>

            <Button
              type="submit"
              size="lg"
              disabled={status === "sending"}
              className="mt-8 h-11 w-full gap-1.5 text-base"
            >
              {status === "sending" ? (
                <>
                  Sending
                  <LoaderCircle className="size-4 animate-spin" strokeWidth={2} />
                </>
              ) : (
                <>
                  Send your idea
                  <ArrowUpRight className="size-4" strokeWidth={1.75} />
                </>
              )}
            </Button>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Prefer email?{" "}
              <a
                href="mailto:hello@devalon.dev"
                className="font-medium text-primary transition-colors hover:underline"
              >
                hello@devalon.dev
              </a>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
