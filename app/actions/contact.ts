"use server"

import { readFileSync } from "node:fs"
import { join } from "node:path"
import { Resend, type Attachment } from "resend"

import {
  buildCustomerConfirmationEmail,
  buildInternalIdeaEmail,
  DEVALON_LOGO_CID,
} from "@/lib/emails/contact-templates"
import { siteEmail, siteName, siteUrl } from "@/lib/site"

export type SendContactResult =
  | { ok: true }
  | { ok: false; error: string }

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

let cachedLogoBuffer: Buffer | null | undefined

function getLogoBuffer(): Buffer | null {
  if (cachedLogoBuffer !== undefined) {
    return cachedLogoBuffer
  }
  try {
    cachedLogoBuffer = readFileSync(
      join(process.cwd(), "public/devalon-logos/dark-txt.png")
    )
  } catch {
    cachedLogoBuffer = null
  }
  return cachedLogoBuffer
}

export async function sendContactIdea(
  formData: FormData
): Promise<SendContactResult> {
  // Honeypot check — bots filling hidden fields get a silent success response
  const honeypot = String(formData.get("company_website") ?? "").trim()
  if (honeypot) {
    return { ok: true }
  }

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const idea = String(formData.get("idea") ?? "").trim()

  if (!name) {
    return { ok: false, error: "Please enter your name." }
  }
  if (name.length > 120) {
    return { ok: false, error: "Name is too long." }
  }

  if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
    return { ok: false, error: "Please enter a valid email address." }
  }

  if (phone.length > 40) {
    return { ok: false, error: "Phone number is too long." }
  }

  if (!idea) {
    return { ok: false, error: "Please describe your project idea." }
  }
  if (idea.length > 5000) {
    return {
      ok: false,
      error: "Project description is too long (max 5,000 characters).",
    }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[sendContactIdea] Missing RESEND_API_KEY environment variable.")
    return {
      ok: false,
      error: "Email service is not configured yet. Please email us directly.",
    }
  }

  const resend = new Resend(apiKey)
  const fromAddress =
    process.env.RESEND_FROM_EMAIL?.trim() || `${siteName} <${siteEmail}>`

  const logoBuffer = getLogoBuffer()
  const logoSrc = logoBuffer
    ? `cid:${DEVALON_LOGO_CID}`
    : `${siteUrl}/devalon-logos/dark-txt.png`

  const attachments: Attachment[] | undefined = logoBuffer
    ? [
        {
          filename: "devalon-logo.png",
          content: logoBuffer,
          contentType: "image/png",
          contentId: DEVALON_LOGO_CID,
        },
      ]
    : undefined

  const submission = {
    name,
    email,
    phone: phone || undefined,
    idea,
    submittedAt: new Date(),
  }

  const internalTemplate = buildInternalIdeaEmail(submission, { logoSrc })
  const confirmationTemplate = buildCustomerConfirmationEmail(submission, {
    logoSrc,
  })

  try {
    const [internalResult, confirmationResult] = await Promise.allSettled([
      resend.emails.send({
        from: fromAddress,
        to: [siteEmail],
        replyTo: `${name.replace(/["<>]/g, "")} <${email}>`,
        subject: internalTemplate.subject,
        html: internalTemplate.html,
        text: internalTemplate.text,
        attachments,
      }),
      resend.emails.send({
        from: fromAddress,
        to: [email],
        replyTo: siteEmail,
        subject: confirmationTemplate.subject,
        html: confirmationTemplate.html,
        text: confirmationTemplate.text,
        attachments,
      }),
    ])

    if (internalResult.status === "rejected") {
      console.error(
        "[sendContactIdea] Failed to send internal notification:",
        internalResult.reason
      )
      return {
        ok: false,
        error: "Could not send your message right now. Please try again.",
      }
    }

    if (internalResult.value.error) {
      console.error(
        "[sendContactIdea] Resend error on internal notification:",
        internalResult.value.error
      )
      return {
        ok: false,
        error: "Could not send your message right now. Please try again.",
      }
    }

    if (confirmationResult.status === "rejected") {
      console.warn(
        "[sendContactIdea] Customer confirmation email failed:",
        confirmationResult.reason
      )
    } else if (confirmationResult.value.error) {
      console.warn(
        "[sendContactIdea] Resend error on customer confirmation:",
        confirmationResult.value.error
      )
    }

    return { ok: true }
  } catch (err) {
    console.error("[sendContactIdea] Unexpected error:", err)
    return {
      ok: false,
      error: "Something went wrong while sending. Please try again.",
    }
  }
}
