import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../../../db'

/** Email the invoice to the customer and mark it SENT (re-sending is allowed). */
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { user } = await requireUserSession(event)
  const db = useDb()
  const [row] = await db.select({ invoice: schema.invoices, customer: schema.customers })
    .from(schema.invoices)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.invoices.customerId))
    .where(eq(schema.invoices.id, id)).limit(1)
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  if (row.invoice.status === 'VOID' || row.invoice.status === 'PAID') {
    throw createError({ statusCode: 422, statusMessage: `Invoice is ${row.invoice.status.toLowerCase()}` })
  }
  const [settings] = await db.select().from(schema.settings).limit(1)
  const mail = renderInvoiceEmail(row.invoice, row.customer, settings!)
  await sendMail(row.customer.email, mail.subject, mail.html, mail.text)
  const [invoice] = await db.update(schema.invoices).set({ status: 'SENT', sentAt: new Date() })
    .where(eq(schema.invoices.id, id)).returning()
  await audit(db, user.id, 'invoice.send', 'invoice', id, { to: row.customer.email })
  return invoice
})
