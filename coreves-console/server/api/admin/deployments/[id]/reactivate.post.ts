import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../../../db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { user } = await requireUserSession(event)
  const db = useDb()
  const [d] = await db.update(schema.deployments).set({ cancelledAt: null })
    .where(eq(schema.deployments.id, id)).returning()
  if (!d) throw createError({ statusCode: 404, statusMessage: 'Deployment not found' })
  await audit(db, user.id, 'deployment.reactivate', 'deployment', id)
  return publicDeployment(d)
})
