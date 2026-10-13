import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../../db'

/** Editable commercial terms. The slug (licence `sub`) is immutable. */
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readValidatedBody(event, DeploymentUpdateBody.parse)
  const { user } = await requireUserSession(event)
  const db = useDb()
  const [d] = await db.update(schema.deployments)
    .set({ ...body, ...(body.domain ? { domain: body.domain.toLowerCase() } : {}) })
    .where(eq(schema.deployments.id, id)).returning()
  if (!d) throw createError({ statusCode: 404, statusMessage: 'Deployment not found' })
  await audit(db, user.id, 'deployment.update', 'deployment', id, body)
  return publicDeployment(d)
})
