import { createHmac } from 'node:crypto'
import type { DemoRequestBody } from './demoRequest'

const TIMEOUT_MS = 3000

/**
 * Copy a demo request into the Coreves console as a lead. Best effort: the
 * visitor's request has already been emailed, so a console outage is logged and
 * never fails the form. Skipped when CONSOLE_LEADS_URL isn't configured.
 *
 * Signed with LEADS_WEBHOOK_SECRET: X-Coreves-Signature = hex HMAC-SHA256 of
 * `${timestamp}.${body}` — verified by coreves-console/server/api/v1/leads.post.ts.
 */
export async function forwardLead(lead: DemoRequestBody, url: string, secret: string): Promise<void> {
  if (!url || !secret) return
  const body = JSON.stringify({
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    inquiryType: lead.inquiryType,
    message: lead.message,
  })
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = createHmac('sha256', secret).update(`${timestamp}.${body}`, 'utf8').digest('hex')
  try {
    await $fetch(url, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        'X-Coreves-Timestamp': String(timestamp),
        'X-Coreves-Signature': signature,
      },
      timeout: TIMEOUT_MS,
      retry: 1,
    })
  } catch (error) {
    console.error('Forwarding demo request to the console failed (email was still sent):', error)
  }
}
