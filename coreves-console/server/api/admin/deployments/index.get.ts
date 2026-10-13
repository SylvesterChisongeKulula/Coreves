import { asc, eq } from 'drizzle-orm'
import { useDb, schema } from '../../../db'

export default defineEventHandler(async () => {
  const rows = await useDb().select({ d: schema.deployments, customer: schema.customers.name })
    .from(schema.deployments)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.deployments.customerId))
    .orderBy(asc(schema.customers.name), asc(schema.deployments.slug))
  return rows.map(({ d, customer }) => ({ ...publicDeployment(d), customer }))
})
