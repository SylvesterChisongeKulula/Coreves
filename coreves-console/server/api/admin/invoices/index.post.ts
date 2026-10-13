import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../../db'

const Body = z.object({
  deploymentId: z.number().int().positive(),
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

/** Draft an invoice for a deployment — its next period by default, or one starting on periodStart. */
export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, Body.parse)
  const { user } = await requireUserSession(event)
  const db = useDb()
  const [d] = await db.select().from(schema.deployments).where(eq(schema.deployments.id, body.deploymentId)).limit(1)
  if (!d) throw createError({ statusCode: 404, statusMessage: 'Deployment not found' })
  if (d.cancelledAt) throw createError({ statusCode: 422, statusMessage: 'Deployment is cancelled' })
  const period = body.periodStart ? periodFrom(body.periodStart, d.plan) : nextPeriod(d.paidThrough, d.plan, toDay(new Date()))
  const invoice = await draftInvoice(db, d, period, user.id)
  if (!invoice) throw createError({ statusCode: 409, statusMessage: `An invoice for the period starting ${period.periodStart} already exists` })
  setResponseStatus(event, 201)
  return invoice
})
