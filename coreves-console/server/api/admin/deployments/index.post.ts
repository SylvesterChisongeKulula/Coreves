import { useDb, schema } from '../../../db'

/** Register a client server. The API key is returned ONCE — only its hash is kept. */
export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, DeploymentCreateBody.parse)
  const { user } = await requireUserSession(event)
  const { key, hash, prefix } = generateApiKey()
  const db = useDb()
  try {
    const [d] = await db.insert(schema.deployments).values({
      ...body, domain: body.domain.toLowerCase(), apiKeyHash: hash, apiKeyPrefix: prefix,
    }).returning()
    await audit(db, user.id, 'deployment.create', 'deployment', d!.id, { slug: body.slug, domain: body.domain })
    setResponseStatus(event, 201)
    return { deployment: publicDeployment(d!), apiKey: key }
  } catch (e: unknown) {
    if (String((e as { cause?: { code?: string } }).cause?.code ?? (e as { code?: string }).code) === '23505') {
      throw createError({ statusCode: 409, statusMessage: `Deployment id '${body.slug}' is already taken` })
    }
    throw e
  }
})
