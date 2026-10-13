import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../../../db'

/** Issue a new API key; the old one stops working immediately. */
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { user } = await requireUserSession(event)
  const { key, hash, prefix } = generateApiKey()
  const db = useDb()
  const [d] = await db.update(schema.deployments).set({ apiKeyHash: hash, apiKeyPrefix: prefix })
    .where(eq(schema.deployments.id, id)).returning({ id: schema.deployments.id })
  if (!d) throw createError({ statusCode: 404, statusMessage: 'Deployment not found' })
  await audit(db, user.id, 'deployment.rotate-key', 'deployment', id)
  return { apiKey: key }
})
