import { and, eq, ne, sql } from 'drizzle-orm'
import type { Db, Tx } from '../db'
import { schema } from '../db'

type Deployment = typeof schema.deployments.$inferSelect
type Invoice = typeof schema.invoices.$inferSelect

/** Next invoice number, allocated under a row lock so concurrent drafts never collide. */
async function allocateInvoiceNumber(tx: Tx, today: string): Promise<string> {
  const year = Number(today.slice(0, 4))
  const [s] = await tx.select().from(schema.settings).where(eq(schema.settings.id, 1)).for('update')
  const sequence = s!.invoiceYear === year ? s!.invoiceSequence + 1 : 1
  await tx.update(schema.settings).set({ invoiceYear: year, invoiceSequence: sequence }).where(eq(schema.settings.id, 1))
  return invoiceNumber(year, sequence)
}

export function describePeriod(d: Pick<Deployment, 'planName' | 'plan'>, periodStart: string, periodEnd: string): string {
  return `${d.planName} — ${d.plan === 'ANNUAL' ? 'annual' : 'monthly'} licence, ${periodStart} to ${periodEnd}`
}

/**
 * Draft an invoice for one billing period. Returns null when that period is
 * already invoiced (any non-void invoice with the same start) — safe to re-run.
 */
export async function draftInvoice(
  db: Db,
  d: Deployment,
  period: { periodStart: string, periodEnd: string },
  userId: number | null,
  today = toDay(new Date()),
): Promise<Invoice | null> {
  return db.transaction(async (tx) => {
    const [existing] = await tx.select({ id: schema.invoices.id }).from(schema.invoices).where(and(
      eq(schema.invoices.deploymentId, d.id),
      eq(schema.invoices.periodStart, period.periodStart),
      ne(schema.invoices.status, 'VOID'),
    )).limit(1)
    if (existing) return null

    const [s] = await tx.select({ terms: schema.settings.paymentTermsDays }).from(schema.settings).limit(1)
    const number = await allocateInvoiceNumber(tx, today)
    // Due by the period start (pay in advance), but never sooner than the payment terms allow.
    const termsDue = addDays(today, s?.terms ?? 7)
    const dueAt = period.periodStart > termsDue ? period.periodStart : termsDue

    const [invoice] = await tx.insert(schema.invoices).values({
      number,
      customerId: d.customerId,
      deploymentId: d.id,
      description: describePeriod(d, period.periodStart, period.periodEnd),
      periodStart: period.periodStart,
      periodEnd: period.periodEnd,
      amount: d.priceAmount,
      currency: d.currency,
      issuedAt: today,
      dueAt,
    }).returning()
    await audit(tx, userId, 'invoice.draft', 'invoice', invoice!.id, { number, ...period })
    return invoice!
  })
}

export interface PaymentInput {
  amount: string
  paidAt: string
  method: 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'OTHER'
  reference?: string
}

/**
 * Record money received against an invoice. When payments cover the invoice it
 * becomes PAID, the deployment's paid-through extends to the period end (never
 * shortens), and a fresh licence is signed — all in one transaction.
 */
export async function recordPayment(db: Db, invoiceId: number, input: PaymentInput, userId: number) {
  return db.transaction(async (tx) => {
    const [invoice] = await tx.select().from(schema.invoices).where(eq(schema.invoices.id, invoiceId)).for('update')
    if (!invoice) throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
    if (invoice.status === 'VOID') throw createError({ statusCode: 422, statusMessage: 'Invoice is void' })
    if (invoice.status === 'PAID') throw createError({ statusCode: 422, statusMessage: 'Invoice is already paid' })

    await tx.insert(schema.payments).values({ invoiceId, ...input, reference: input.reference || null, recordedBy: userId })

    const [{ total }] = await tx.select({ total: sql<string>`coalesce(sum(${schema.payments.amount}), 0)` })
      .from(schema.payments).where(eq(schema.payments.invoiceId, invoiceId)) as [{ total: string }]
    await audit(tx, userId, 'payment.record', 'invoice', invoiceId, { ...input })

    if (Number(total) < Number(invoice.amount)) {
      return { invoice, fullyPaid: false, outstanding: (Number(invoice.amount) - Number(total)).toFixed(2), licence: null }
    }

    const [paid] = await tx.update(schema.invoices).set({ status: 'PAID', paidAt: new Date() })
      .where(eq(schema.invoices.id, invoiceId)).returning()

    const [row] = await tx.select({ d: schema.deployments, customerName: schema.customers.name })
      .from(schema.deployments)
      .innerJoin(schema.customers, eq(schema.customers.id, schema.deployments.customerId))
      .where(eq(schema.deployments.id, invoice.deploymentId)).for('update')
    const paidThrough = extendPaidThrough(row!.d.paidThrough, invoice.periodEnd)
    const [d] = await tx.update(schema.deployments).set({ paidThrough })
      .where(eq(schema.deployments.id, invoice.deploymentId)).returning()

    const licence = await issueLicence(tx, d!, row!.customerName, userId, `payment for ${invoice.number}`)
    return { invoice: paid!, fullyPaid: true, outstanding: '0.00', licence }
  })
}
