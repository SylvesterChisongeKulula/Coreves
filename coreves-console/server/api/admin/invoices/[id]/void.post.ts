import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../../../db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { user } = await requireUserSession(event)
  const db = useDb()
  const [current] = await db.select().from(schema.invoices).where(eq(schema.invoices.id, id)).limit(1)
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  if (current.status === 'PAID') throw createError({ statusCode: 422, statusMessage: 'A paid invoice cannot be voided' })
  const [invoice] = await db.update(schema.invoices).set({ status: 'VOID' }).where(eq(schema.invoices.id, id)).returning()
  await audit(db, user.id, 'invoice.void', 'invoice', id)
  return invoice
})
