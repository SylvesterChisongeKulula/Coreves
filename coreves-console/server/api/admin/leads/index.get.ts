import { desc, eq } from 'drizzle-orm'
import { useDb, schema } from '../../../db'

export default defineEventHandler(async (event) => {
  const { status } = getQuery(event)
  const db = useDb()
  const statuses = ['NEW', 'CONTACTED', 'DEMO', 'WON', 'LOST'] as const
  const filter = statuses.find(s => s === status)
  return db.select().from(schema.leads)
    .where(filter ? eq(schema.leads.status, filter) : undefined)
    .orderBy(desc(schema.leads.receivedAt)).limit(500)
})
