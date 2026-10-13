import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../../../db'

/** The current licence token, for pasting into a server that can't reach the console. */
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { user } = await requireUserSession(event)
  const db = useDb()
  const [d] = await db.select({ id: schema.deployments.id }).from(schema.deployments)
    .where(eq(schema.deployments.id, id)).limit(1)
  if (!d) throw createError({ statusCode: 404, statusMessage: 'Deployment not found' })
  const licence = await latestLicence(db, id)
  if (!licence) throw createError({ statusCode: 404, statusMessage: 'No licence issued yet' })
  await audit(db, user.id, 'licence.copy', 'deployment', id, { licenceId: licence.id })
  return { token: licence.token, paidThrough: licence.paidThrough, issuedAt: licence.issuedAt }
})
