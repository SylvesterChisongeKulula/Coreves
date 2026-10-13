import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../../db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readValidatedBody(event, CustomerBody.partial().parse)
  const { user } = await requireUserSession(event)
  const db = useDb()
  const [customer] = await db.update(schema.customers).set(body).where(eq(schema.customers.id, id)).returning()
  if (!customer) throw createError({ statusCode: 404, statusMessage: 'Customer not found' })
  await audit(db, user.id, 'customer.update', 'customer', id, body)
  return customer
})
