import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../../db'

const Body = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'DEMO', 'WON', 'LOST']).optional(),
  notes: z.string().max(10_000).nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readValidatedBody(event, Body.parse)
  const { user } = await requireUserSession(event)
  const db = useDb()
  const [lead] = await db.update(schema.leads).set(body).where(eq(schema.leads.id, id)).returning()
  if (!lead) throw createError({ statusCode: 404, statusMessage: 'Lead not found' })
  await audit(db, user.id, 'lead.update', 'lead', id, body)
  return lead
})
