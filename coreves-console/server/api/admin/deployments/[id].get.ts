import { desc, eq } from 'drizzle-orm'
import { useDb, schema } from '../../../db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()
  const [row] = await db.select({ d: schema.deployments, customer: schema.customers })
    .from(schema.deployments)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.deployments.customerId))
    .where(eq(schema.deployments.id, id)).limit(1)
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Deployment not found' })
  const licences = await db.select({
    id: schema.licences.id, paidThrough: schema.licences.paidThrough, graceDays: schema.licences.graceDays,
    issuedAt: schema.licences.issuedAt, reason: schema.licences.reason, domain: schema.licences.domain,
  }).from(schema.licences).where(eq(schema.licences.deploymentId, id))
    .orderBy(desc(schema.licences.issuedAt), desc(schema.licences.id)).limit(20)
  const invoices = await db.select().from(schema.invoices).where(eq(schema.invoices.deploymentId, id))
    .orderBy(desc(schema.invoices.periodStart), desc(schema.invoices.id))
  return {
    deployment: publicDeployment(row.d),
    customer: row.customer,
    licences,
    invoices,
    nextPeriod: nextPeriod(row.d.paidThrough, row.d.plan, toDay(new Date())),
    clientEnv: {
      BILLING_DEPLOYMENT_ID: row.d.slug,
      BILLING_API_URL: useRuntimeConfig().public.consoleUrl,
      APP_DOMAIN: row.d.domain,
    },
  }
})
