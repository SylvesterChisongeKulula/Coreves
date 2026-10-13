import { z } from 'zod'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { useDb, schema } from '../../db'

const Body = z.object({ code: z.string().regex(/^\d{6}$/) })
const MAX_ATTEMPTS = 5

/** Step 2: the emailed code. Completes sign-in. */
export default defineEventHandler(async (event) => {
  const { code } = await readValidatedBody(event, Body.parse)
  const session = await getUserSession(event)
  const userId = session.pendingUserId
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Sign in with your password first' })

  const db = useDb()
  const [row] = await db.select().from(schema.loginCodes)
    .where(and(eq(schema.loginCodes.userId, userId), isNull(schema.loginCodes.usedAt)))
    .orderBy(desc(schema.loginCodes.createdAt)).limit(1)

  const fail = (msg: string) => createError({ statusCode: 401, statusMessage: msg })
  if (!row || row.expiresAt < new Date()) throw fail('Code expired — sign in again')
  if (row.attempts >= MAX_ATTEMPTS) throw fail('Too many attempts — sign in again')

  if (row.codeHash !== hashLoginCode(code, userId)) {
    await db.update(schema.loginCodes).set({ attempts: row.attempts + 1 }).where(eq(schema.loginCodes.id, row.id))
    throw fail('Incorrect code')
  }
  await db.update(schema.loginCodes).set({ usedAt: new Date() }).where(eq(schema.loginCodes.id, row.id))

  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1)
  if (!user?.active) throw fail('Account is disabled')

  await replaceUserSession(event, { user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  await audit(db, user.id, 'login', 'user', user.id)
  return { ok: true }
})
