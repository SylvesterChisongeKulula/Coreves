import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../../db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()
  const [row] = await db.select({ invoice: schema.invoices, customer: schema.customers, deployment: schema.deployments })
    .from(schema.invoices)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.invoices.customerId))
    .innerJoin(schema.deployments, eq(schema.deployments.id, schema.invoices.deploymentId))
    .where(eq(schema.invoices.id, id)).limit(1)
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  const payments = await db.select().from(schema.payments).where(eq(schema.payments.invoiceId, id))
  const [settings] = await db.select().from(schema.settings).limit(1)
  // The settings row is created at boot (plugins/01.migrate.ts), so it always exists.
  return { invoice: row.invoice, customer: row.customer, deployment: publicDeployment(row.deployment), payments, settings: settings! }
})
