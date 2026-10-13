import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../../../db'

const Body = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount like 1000 or 1000.00'),
  paidAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  method: z.enum(['BANK_TRANSFER', 'MOBILE_MONEY', 'OTHER']),
  reference: z.string().trim().max(200).optional(),
})

/** Record money received; when the invoice is covered, access is extended + a licence signed. */
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readValidatedBody(event, Body.parse)
  const { user } = await requireUserSession(event)
  const db = useDb()
  const result = await recordPayment(db, id, body, user.id)

  if (result.fullyPaid) {
    const [row] = await db.select({ invoice: schema.invoices, customer: schema.customers })
      .from(schema.invoices)
      .innerJoin(schema.customers, eq(schema.customers.id, schema.invoices.customerId))
      .where(eq(schema.invoices.id, id)).limit(1)
    try {
      const mail = renderReceiptEmail(row!.invoice, row!.customer, body)
      await sendMail(row!.customer.email, mail.subject, mail.html, mail.text)
    } catch (e) {
      console.error('[payments] receipt email failed — payment is still recorded', e)
    }
  }
  return {
    fullyPaid: result.fullyPaid,
    outstanding: result.outstanding,
    licenceIssued: !!result.licence,
    paidThrough: result.licence?.paidThrough ?? null,
  }
})
