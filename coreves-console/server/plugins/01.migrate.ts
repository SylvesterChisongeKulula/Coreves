import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { useDb, schema } from '../db'

/**
 * On boot: apply pending migrations, ensure the settings row exists, and create
 * the first OWNER from CONSOLE_OWNER_EMAIL / CONSOLE_OWNER_PASSWORD when the
 * console has no users yet (never touches existing users).
 */
export default defineNitroPlugin(async () => {
  if (import.meta.prerender) return
  const db = useDb()
  await migrate(db, { migrationsFolder: useRuntimeConfig().migrationsDir })

  await db.insert(schema.settings).values({ id: 1 }).onConflictDoNothing()

  const anyUser = await db.select({ id: schema.users.id }).from(schema.users).limit(1)
  if (anyUser.length === 0) {
    const { ownerEmail, ownerPassword } = useRuntimeConfig()
    if (!ownerEmail || !ownerPassword) {
      console.warn('[console] No users yet — set CONSOLE_OWNER_EMAIL and CONSOLE_OWNER_PASSWORD to create the owner')
      return
    }
    await db.insert(schema.users).values({
      email: ownerEmail.trim().toLowerCase(),
      name: 'Owner',
      passwordHash: await hashPassword(ownerPassword),
      role: 'OWNER',
    })
    console.info(`[console] Created owner account ${ownerEmail}`)
  }
})
