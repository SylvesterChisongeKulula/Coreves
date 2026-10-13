import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../../../db'

/** Cancel: the next poll returns status CANCELLED and the client app goes read-only. */
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { user } = await requireUserSession(event)
  const db = useDb()
  const [d] = await db.update(schema.deployments).set({ cancelledAt: new Date() })
    .where(eq(schema.deployments.id, id)).returning()
  if (!d) throw createError({ statusCode: 404, statusMessage: 'Deployment not found' })
  await audit(db, user.id, 'deployment.cancel', 'deployment', id)
  return publicDeployment(d)
})
