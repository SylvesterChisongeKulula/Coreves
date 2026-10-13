import { Resend } from 'resend'

let resend: Resend | undefined

/**
 * Send an email through Resend. In local dev without RESEND_API_KEY the message
 * is printed to the server log instead, so the console is usable offline.
 */
export async function sendMail(to: string, subject: string, html: string, text?: string) {
  const { resendApiKey, mailFrom } = useRuntimeConfig()
  if (!resendApiKey) {
    if (import.meta.dev) {
      console.info(`[mail:dev] to=${to} subject="${subject}"\n${text ?? html}`)
      return
    }
    throw createError({ statusCode: 500, statusMessage: 'Email is not configured (RESEND_API_KEY)' })
  }
  resend ??= new Resend(resendApiKey)
  const { error } = await resend.emails.send({ from: mailFrom, to, subject, html, text })
  if (error) {
    console.error('[mail] send failed', error)
    throw createError({ statusCode: 502, statusMessage: 'Email could not be sent' })
  }
}

export function escapeHtml(s: string | null | undefined): string {
  return (s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
