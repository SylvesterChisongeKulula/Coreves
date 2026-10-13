import { z } from 'zod'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { useDb, schema } from '../../db'

const Body = z.object({ email: z.string().email(), password: z.string().min(1) })
const CODE_TTL_MS = 10 * 60_000

/** Step 1: password. On success, email a 6-digit code and mark the session pending. */
export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, Body.parse)
  const db = useDb()
  const [user] = await db.select().from(schema.users)
    .where(sql`lower(${schema.users.email}) = ${email.trim().toLowerCase()}`).limit(1)

  const ok = user?.active && await verifyPassword(user.passwordHash, password)
  if (!user || !ok) throw createError({ statusCode: 401, statusMessage: 'Email or password is incorrect' })

  // Invalidate earlier unused codes, then issue a fresh one.
  await db.update(schema.loginCodes).set({ usedAt: new Date() })
    .where(and(eq(schema.loginCodes.userId, user.id), isNull(schema.loginCodes.usedAt)))
  const code = generateLoginCode()
  await db.insert(schema.loginCodes).values({
    userId: user.id,
    codeHash: hashLoginCode(code, user.id),
    expiresAt: new Date(Date.now() + CODE_TTL_MS),
  })
  await sendMail(user.email, `Your Coreves console sign-in code: ${code}`,
    `<p>Your sign-in code is <strong style="font-size:20px;letter-spacing:2px">${code}</strong>.</p>
     <p>It expires in 10 minutes. If you didn't try to sign in, change your password.</p>`,
    `Your Coreves console sign-in code is ${code}. It expires in 10 minutes.`)

  await replaceUserSession(event, { pendingUserId: user.id })
  return { next: 'code' }
})
