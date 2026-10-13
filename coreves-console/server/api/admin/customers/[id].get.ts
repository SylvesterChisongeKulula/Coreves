import { desc, eq } from 'drizzle-orm'
import { useDb, schema } from '../../../db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()
  const [customer] = await db.select().from(schema.customers).where(eq(schema.customers.id, id)).limit(1)
  if (!customer) throw createError({ statusCode: 404, statusMessage: 'Customer not found' })
  const deployments = await db.select({
    id: schema.deployments.id, slug: schema.deployments.slug, domain: schema.deployments.domain,
    plan: schema.deployments.plan, paidThrough: schema.deployments.paidThrough,
    cancelledAt: schema.deployments.cancelledAt, lastSeenAt: schema.deployments.lastSeenAt,
  }).from(schema.deployments).where(eq(schema.deployments.customerId, id))
  const invoices = await db.select().from(schema.invoices).where(eq(schema.invoices.customerId, id))
    .orderBy(desc(schema.invoices.issuedAt), desc(schema.invoices.id))
  return { customer, deployments, invoices }
})
