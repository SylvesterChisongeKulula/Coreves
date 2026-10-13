import { z } from 'zod'
import { and, eq, ne } from 'drizzle-orm'
import { useDb, schema } from '../../../db'

const Body = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  role: z.enum(['OWNER', 'BILLING', 'VIEWER']).optional(),
  active: z.boolean().optional(),
  password: z.string().min(12, 'At least 12 characters').optional(),
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { password, ...rest } = await readValidatedBody(event, Body.parse)
  const { user } = await requireUserSession(event)
  const db = useDb()

  // Never leave the console without an active owner.
  if (rest.role && rest.role !== 'OWNER' || rest.active === false) {
    const others = await db.select({ id: schema.users.id }).from(schema.users).where(and(
      eq(schema.users.role, 'OWNER'), eq(schema.users.active, true), ne(schema.users.id, id),
    )).limit(1)
    const [target] = await db.select({ role: schema.users.role }).from(schema.users).where(eq(schema.users.id, id)).limit(1)
    if (target?.role === 'OWNER' && others.length === 0) {
      throw createError({ statusCode: 422, statusMessage: 'Keep at least one active owner' })
    }
  }

  const [updated] = await db.update(schema.users).set({
    ...rest, ...(password ? { passwordHash: await hashPassword(password) } : {}),
  }).where(eq(schema.users.id, id))
    .returning({ id: schema.users.id, email: schema.users.email, name: schema.users.name, role: schema.users.role, active: schema.users.active })
  if (!updated) throw createError({ statusCode: 404, statusMessage: 'User not found' })
  await audit(db, user.id, 'user.update', 'user', id, { ...rest, passwordChanged: !!password })
  return updated
})
