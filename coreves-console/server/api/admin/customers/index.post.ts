import { useDb, schema } from '../../../db'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, CustomerBody.parse)
  const { user } = await requireUserSession(event)
  const db = useDb()
  const [customer] = await db.insert(schema.customers).values(body).returning()
  await audit(db, user.id, 'customer.create', 'customer', customer!.id, { name: body.name })
  setResponseStatus(event, 201)
  return customer
})
