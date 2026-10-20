import {
  siteCity,
  siteCountry,
  siteEmail,
  siteName,
  sitePhoneDisplay,
  sitePhoneHref,
  siteUrl,
} from "@/lib/site"

export interface ContactSubmissionData {
  name: string
  email: string
  phone?: string
  idea: string
  submittedAt?: Date
}

export interface RenderedEmailTemplate {
  subject: string
  html: string
  text: string
}

export const DEVALON_LOGO_CID = "devalon-logo"

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function getFirstName(fullName: string): string {
  const trimmed = fullName.trim()
  if (!trimmed) return "there"
  return trimmed.split(/\s+/)[0]
}

function formatIdeaHtml(idea: string): string {
  return escapeHtml(idea.trim()).replace(/\r\n|\r|\n/g, "<br />")
}

/**
 * Internal notification email sent to `contact@devalon.dev` containing
 * the lead's details and project description.
 */
export function buildInternalIdeaEmail(
  data: ContactSubmissionData,
  options?: { logoSrc?: string }
): RenderedEmailTemplate {
  const logoSrc = options?.logoSrc ?? `cid:${DEVALON_LOGO_CID}`
  const safeName = escapeHtml(data.name.trim())
  const safeEmail = escapeHtml(data.email.trim())
  const rawPhone = data.phone?.trim() || ""
  const safePhone = rawPhone ? escapeHtml(rawPhone) : ""
  const phoneHref = rawPhone.replace(/[^\d+]/g, "")
  const safeIdeaHtml = formatIdeaHtml(data.idea)
  const firstName = escapeHtml(getFirstName(data.name))
  const timestamp = (data.submittedAt ?? new Date()).toUTCString()
  const replySubject = encodeURIComponent(`Re: Your project inquiry — ${siteName}`)

  const subject = `New project inquiry — ${data.name.trim()}`

  const text = [
    `NEW PROJECT INQUIRY — ${siteName.toUpperCase()}`,
    `Received: ${timestamp}`,
    "",
    `Name:  ${data.name.trim()}`,
    `Email: ${data.email.trim()}`,
    `Phone: ${rawPhone || "—"}`,
    "",
    "PROJECT BRIEF",
    "----------------------------------------",
    data.idea.trim(),
    "----------------------------------------",
    "",
    `Reply directly to this email to respond to ${data.name.trim()}.`,
  ].join("\n")

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #09090b; -webkit-font-smoothing: antialiased;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; mso-hide: all;">
      New project inquiry from ${safeName} (${safeEmail}).
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 48px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e4e4e7; border-top: 2px solid #0f172a;">
            <!-- Header -->
            <tr>
              <td style="padding: 36px 40px 28px 40px; border-bottom: 1px solid #f1f5f9;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" valign="middle">
                      <a href="${siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                        <img src="${logoSrc}" width="124" height="27" alt="${siteName}" style="display: block; border: 0; outline: none; text-decoration: none;" />
                      </a>
                    </td>
                    <td align="right" valign="middle" style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #4e6cb8;">
                      NEW INQUIRY
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td style="padding: 36px 40px;">
                <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; letter-spacing: -0.02em; color: #0f172a;">
                  Project Inquiry
                </h1>
                <p style="margin: 0 0 28px 0; font-size: 13px; line-height: 1.5; color: #71717a;">
                  Submitted via <a href="${siteUrl}" style="color: #0f172a; text-decoration: none; border-bottom: 1px solid #d4d4d8;">devalon.dev</a>
                </p>

                <!-- Metadata Grid -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px; border-top: 1px solid #e4e4e7;">
                  <tr>
                    <td width="120" style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a;">
                      Client
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; font-size: 14px; font-weight: 500; color: #09090b;">
                      ${safeName}
                    </td>
                  </tr>
                  <tr>
                    <td width="120" style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a;">
                      Email
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; font-size: 14px; color: #09090b;">
                      <a href="mailto:${safeEmail}" style="color: #4e6cb8; text-decoration: none; font-weight: 500;">${safeEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td width="120" style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a;">
                      Phone
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; font-size: 14px; color: #09090b;">
                      ${
                        safePhone
                          ? `<a href="tel:${escapeHtml(phoneHref)}" style="color: #09090b; text-decoration: none;">${safePhone}</a>`
                          : `<span style="color: #a1a1aa;">&mdash;</span>`
                      }
                    </td>
                  </tr>
                </table>

                <!-- Project Brief -->
                <div style="margin-bottom: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a;">
                  Project Brief
                </div>
                <div style="padding: 20px 24px; background-color: #fafafa; border-left: 2px solid #0f172a; font-size: 14px; line-height: 1.7; color: #18181b; word-break: break-word;">
                  ${safeIdeaHtml}
                </div>

                <!-- Action -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px;">
                  <tr>
                    <td align="left" style="background-color: #0f172a;">
                      <a href="mailto:${safeEmail}?subject=${replySubject}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; font-size: 13px; font-weight: 500; letter-spacing: 0.02em; text-decoration: none;">
                        Reply to ${firstName} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 20px 40px; background-color: #fafafa; border-top: 1px solid #e4e4e7;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; color: #71717a;">
                      ${escapeHtml(timestamp)}
                    </td>
                    <td align="right" style="font-size: 12px; color: #71717a;">
                      <a href="${siteUrl}" style="color: #52525b; text-decoration: none;">devalon.dev</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  return { subject, html, text }
}

/**
 * Confirmation email sent to the customer after they submit the form.
 * Designed with a sharp, editorial, enterprise aesthetic.
 */
export function buildCustomerConfirmationEmail(
  data: ContactSubmissionData,
  options?: { logoSrc?: string }
): RenderedEmailTemplate {
  const logoSrc = options?.logoSrc ?? `cid:${DEVALON_LOGO_CID}`
  const firstName = escapeHtml(getFirstName(data.name))
  const safeName = escapeHtml(data.name.trim())
  const safeEmail = escapeHtml(data.email.trim())
  const rawPhone = data.phone?.trim() || ""
  const safePhone = rawPhone ? escapeHtml(rawPhone) : ""
  const safeIdeaHtml = formatIdeaHtml(data.idea)

  const subject = `Inquiry received — ${siteName}`

  const text = [
    `Hello ${getFirstName(data.name)},`,
    "",
    "Thank you for contacting Devalon. We have received your project inquiry and our team is reviewing your brief.",
    "",
    "We respond to every inquiry with a direct, straightforward assessment — typically within one business day. If you would like to share additional specifications, links, or documentation in the meantime, simply reply to this email.",
    "",
    "SUMMARY OF YOUR INQUIRY",
    "----------------------------------------",
    `Name:  ${data.name.trim()}`,
    `Email: ${data.email.trim()}`,
    ...(rawPhone ? [`Phone: ${rawPhone}`] : []),
    "",
    data.idea.trim(),
    "----------------------------------------",
    "",
    "Best regards,",
    siteName,
    "AI & Software Development Studio",
    `${siteUrl} · ${siteEmail} · ${sitePhoneDisplay}`,
  ].join("\n")

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #09090b; -webkit-font-smoothing: antialiased;">
    <!-- Preheader -->
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; mso-hide: all;">
      We have received your project inquiry and will respond within one business day.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 48px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e4e4e7; border-top: 2px solid #0f172a;">
            <!-- Header -->
            <tr>
              <td style="padding: 36px 40px 28px 40px; border-bottom: 1px solid #f1f5f9;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" valign="middle">
                      <a href="${siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                        <img src="${logoSrc}" width="124" height="27" alt="${siteName}" style="display: block; border: 0; outline: none; text-decoration: none;" />
                      </a>
                    </td>
                    <td align="right" valign="middle" style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #71717a;">
                      INQUIRY RECEIVED
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px 40px 36px 40px;">
                <h1 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.3; color: #0f172a;">
                  We have received your project inquiry.
                </h1>

                <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.7; color: #27272a;">
                  Hello ${firstName},
                </p>

                <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.7; color: #3f3f46;">
                  Thank you for reaching out to ${siteName}. Your project brief has been logged and is currently under review by our engineering team.
                </p>

                <p style="margin: 0 0 32px 0; font-size: 14px; line-height: 1.7; color: #3f3f46;">
                  We respond to every inquiry with a direct, candid assessment of scope and feasibility &mdash; typically within one business day. Should you wish to share additional specifications, architecture documents, or links in the meantime, simply reply to this email.
                </p>

                <!-- Architectural Specification Summary -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e4e4e7; border-bottom: 1px solid #e4e4e7; margin-bottom: 32px;">
                  <tr>
                    <td style="padding: 20px 0 8px 0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a;">
                      Submission Summary
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0 16px 0;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="100" valign="top" style="padding: 4px 0; font-size: 12px; color: #71717a;">
                            Contact
                          </td>
                          <td valign="top" style="padding: 4px 0; font-size: 13px; color: #09090b; font-weight: 500;">
                            ${safeName} &lt;${safeEmail}&gt;
                          </td>
                        </tr>
                        ${
                          safePhone
                            ? `<tr>
                          <td width="100" valign="top" style="padding: 4px 0; font-size: 12px; color: #71717a;">
                            Phone
                          </td>
                          <td valign="top" style="padding: 4px 0; font-size: 13px; color: #09090b;">
                            ${safePhone}
                          </td>
                        </tr>`
                            : ""
                        }
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 20px; background-color: #fafafa; border-left: 2px solid #4e6cb8; font-size: 13px; line-height: 1.7; color: #27272a; word-break: break-word;">
                      ${safeIdeaHtml}
                    </td>
                  </tr>
                  <tr>
                    <td style="height: 20px; font-size: 0; line-height: 0;">&nbsp;</td>
                  </tr>
                </table>

                <!-- Sign-off -->
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #27272a;">
                  Best regards,<br />
                  <strong style="color: #0f172a; font-weight: 600;">${siteName}</strong><br />
                  <span style="font-size: 12px; color: #71717a;">AI &amp; Software Development Studio</span>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 24px 40px; background-color: #fafafa; border-top: 1px solid #e4e4e7;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" style="font-size: 12px; line-height: 1.6; color: #71717a;">
                      <a href="${siteUrl}" style="color: #0f172a; font-weight: 500; text-decoration: none;">devalon.dev</a>
                      &nbsp;&middot;&nbsp;
                      <a href="mailto:${siteEmail}" style="color: #52525b; text-decoration: none;">${siteEmail}</a>
                      &nbsp;&middot;&nbsp;
                      <a href="${sitePhoneHref}" style="color: #52525b; text-decoration: none;">${sitePhoneDisplay}</a>
                    </td>
                    <td align="right" style="font-size: 12px; color: #a1a1aa;">
                      ${siteCity}, ${siteCountry}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  return { subject, html, text }
}
