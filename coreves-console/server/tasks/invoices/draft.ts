import { isNull } from 'drizzle-orm'
import { useDb, schema } from '../../db'

/**
 * Monthly (25th, 06:00): draft next-period invoices for every active deployment
 * whose paid-through ends within the coming month. Idempotent — an already
 * invoiced period is skipped. Drafts are reviewed and sent by a person.
 */
export default defineTask({
  meta: { name: 'invoices:draft', description: 'Draft next-period invoices for active deployments' },
  async run() {
    const db = useDb()
    const today = toDay(new Date())
    const horizon = addMonths(today, 1)
    const active = await db.select().from(schema.deployments).where(isNull(schema.deployments.cancelledAt))
    let drafted = 0
    for (const d of active) {
      if (!d.paidThrough) continue // never paid: onboarding invoices are created by hand
      if (toDay(d.paidThrough) > horizon) continue // annual plans etc. not due yet
      const invoice = await draftInvoice(db, d, nextPeriod(d.paidThrough, d.plan, today), null, today)
      if (invoice) drafted++
    }
    console.info(`[invoices:draft] drafted ${drafted} invoice(s)`)
    return { result: { drafted } }
  },
})
