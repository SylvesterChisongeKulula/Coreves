import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../../db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const [lead] = await useDb().select().from(schema.leads).where(eq(schema.leads.id, id)).limit(1)
  if (!lead) throw createError({ statusCode: 404, statusMessage: 'Lead not found' })
  return lead
})
