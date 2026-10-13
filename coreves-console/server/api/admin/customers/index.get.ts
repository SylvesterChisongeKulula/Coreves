import { asc, sql } from 'drizzle-orm'
import { useDb, schema } from '../../../db'

export default defineEventHandler(async () => {
  const db = useDb()
  return db.select({
    id: schema.customers.id, name: schema.customers.name, email: schema.customers.email,
    contactName: schema.customers.contactName, phone: schema.customers.phone,
    deployments: sql<number>`(select count(*)::int from ${schema.deployments} d where d.customer_id = ${schema.customers.id})`,
  }).from(schema.customers).orderBy(asc(schema.customers.name))
})
