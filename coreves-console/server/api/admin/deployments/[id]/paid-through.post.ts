import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../../../db'

const Body = z.object({
  paidThrough: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().trim().min(3).max(500),
})

/**
 * Set paid-through directly (go-live before the first invoice, a goodwill extension,
 * or a correction) and sign a licence for it. Always audited with a reason.
 */
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { paidThrough, reason } = await readValidatedBody(event, Body.parse)
  const { user } = await requireUserSession(event)
  const db = useDb()
  return db.transaction(async (tx) => {
    const [row] = await tx.select({ customerName: schema.customers.name })
      .from(schema.deployments)
      .innerJoin(schema.customers, eq(schema.customers.id, schema.deployments.customerId))
      .where(eq(schema.deployments.id, id)).limit(1)
    if (!row) throw createError({ statusCode: 404, statusMessage: 'Deployment not found' })
    const [d] = await tx.update(schema.deployments).set({ paidThrough: endOfDay(paidThrough) })
      .where(eq(schema.deployments.id, id)).returning()
    const licence = await issueLicence(tx, d!, row.customerName, user.id, `manual: ${reason}`)
    return { deployment: publicDeployment(d!), licenceId: licence.id }
  })
})
