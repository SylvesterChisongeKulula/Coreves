import { desc, eq } from 'drizzle-orm'
import { useDb, schema } from '../../../db'

export default defineEventHandler(async (event) => {
  const { status } = getQuery(event)
  const statuses = ['DRAFT', 'SENT', 'PAID', 'VOID'] as const
  const filter = statuses.find(s => s === status)
  return useDb().select({
    invoice: schema.invoices, customer: schema.customers.name, slug: schema.deployments.slug,
  }).from(schema.invoices)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.invoices.customerId))
    .innerJoin(schema.deployments, eq(schema.deployments.id, schema.invoices.deploymentId))
    .where(filter ? eq(schema.invoices.status, filter) : undefined)
    .orderBy(desc(schema.invoices.issuedAt), desc(schema.invoices.id)).limit(500)
})
