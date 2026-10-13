import { z } from 'zod'
import { and, eq, gt } from 'drizzle-orm'
import { useDb, schema } from '../../db'

const Lead = z.object({
  name: z.string().trim().min(1).max(200),
  company: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(50).optional().default(''),
  inquiryType: z.string().trim().max(100).optional().default(''),
  message: z.string().trim().max(5000).optional().default(''),
})

const DEDUPE_WINDOW_MS = 10 * 60_000

/**
 * Demo requests from the company website (coreves-frontend/server/utils/forwardLead.ts),
 * signed with LEADS_WEBHOOK_SECRET. Idempotent within 10 minutes per email+message.
 */
export default defineEventHandler(async (event) => {
  const raw = (await readRawBody(event, 'utf8')) ?? ''
  const result = verifyWebhook(
    useRuntimeConfig().leadsWebhookSecret,
    getHeader(event, 'x-coreves-timestamp'),
    getHeader(event, 'x-coreves-signature'),
    raw,
  )
  if (result !== 'ok') {
    console.warn(`[leads] rejected webhook: ${result}`)
    throw createError({ statusCode: 401, statusMessage: 'Invalid signature' })
  }

  let parsed: z.infer<typeof Lead>
  try {
    parsed = Lead.parse(JSON.parse(raw))
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid lead payload' })
  }

  const db = useDb()
  const [dupe] = await db.select({ id: schema.leads.id }).from(schema.leads).where(and(
    eq(schema.leads.email, parsed.email.toLowerCase()),
    eq(schema.leads.message, parsed.message),
    gt(schema.leads.receivedAt, new Date(Date.now() - DEDUPE_WINDOW_MS)),
  )).limit(1)
  if (dupe) return { id: dupe.id, duplicate: true }

  const [lead] = await db.insert(schema.leads).values({
    ...parsed,
    email: parsed.email.toLowerCase(),
    source: 'website',
  }).returning({ id: schema.leads.id })
  await audit(db, null, 'lead.received', 'lead', lead!.id, { company: parsed.company })
  setResponseStatus(event, 201)
  return { id: lead!.id, duplicate: false }
})
