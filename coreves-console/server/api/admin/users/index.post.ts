import { z } from 'zod'
import { useDb, schema } from '../../../db'

const Body = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(1).max(200),
  role: z.enum(['OWNER', 'BILLING', 'VIEWER']),
  password: z.string().min(12, 'At least 12 characters'),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, Body.parse)
  const { user } = await requireUserSession(event)
  const db = useDb()
  try {
    const [created] = await db.insert(schema.users).values({
      email: body.email.toLowerCase(), name: body.name, role: body.role,
      passwordHash: await hashPassword(body.password),
    }).returning({ id: schema.users.id, email: schema.users.email, name: schema.users.name, role: schema.users.role })
    await audit(db, user.id, 'user.create', 'user', created!.id, { email: created!.email, role: created!.role })
    setResponseStatus(event, 201)
    return created
  } catch (e: unknown) {
    if (String((e as { cause?: { code?: string } }).cause?.code ?? (e as { code?: string }).code) === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'A user with that email already exists' })
    }
    throw e
  }
})
