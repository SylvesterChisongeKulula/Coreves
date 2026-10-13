import { and, desc, eq } from 'drizzle-orm'
import { useDb, schema } from '../../../../db'

/**
 * Polled hourly by every CoreVesFin deployment (BillingClient.java). Response
 * shape = RemoteSubscription.java; only `licence` grants access. Every failure is
 * a plain 401/404 so a deployment simply keeps its current licence.
 */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const auth = getHeader(event, 'authorization') ?? ''
  const presented = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''

  const db = useDb()
  const [row] = await db.select({ d: schema.deployments, customerName: schema.customers.name })
    .from(schema.deployments)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.deployments.customerId))
    .where(eq(schema.deployments.slug, slug)).limit(1)

  // Same response for unknown deployment and wrong key: don't reveal which ids exist.
  if (!row || !presented || !apiKeyMatches(presented, row.d.apiKeyHash)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  const d = row.d

  const enforcement = getHeader(event, 'x-subscription-enforcement')
  await db.update(schema.deployments).set({
    lastSeenAt: new Date(),
    lastSeenIp: getRequestIP(event, { xForwardedFor: true }) ?? null,
    lastEnforcement: enforcement === 'on' || enforcement === 'off' ? enforcement : null,
  }).where(eq(schema.deployments.id, d.id))

  let licence = await latestLicence(db, d.id)
  if (!d.cancelledAt && licenceIsStale(d, licence)) {
    licence = await issueLicence(db, d, row.customerName, null, 'poll: entitlement changed')
  }

  const [lastPayment] = await db
    .select({ paidAt: schema.payments.paidAt, amount: schema.payments.amount })
    .from(schema.payments)
    .innerJoin(schema.invoices, eq(schema.invoices.id, schema.payments.invoiceId))
    .where(and(eq(schema.invoices.deploymentId, d.id)))
    .orderBy(desc(schema.payments.paidAt), desc(schema.payments.id)).limit(1)

  return {
    deploymentId: d.slug,
    status: d.cancelledAt ? 'CANCELLED' : 'ACTIVE',
    planName: d.planName,
    priceAmount: Number(d.priceAmount),
    currency: d.currency,
    billingInterval: d.plan,
    lastPaymentAt: lastPayment ? `${lastPayment.paidAt}T00:00:00Z` : null,
    lastPaymentAmount: lastPayment ? Number(lastPayment.amount) : null,
    notes: null,
    licence: d.cancelledAt ? null : (licence?.token ?? null),
  }
})
