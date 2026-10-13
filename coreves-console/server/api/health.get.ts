import { sql } from 'drizzle-orm'
import { useDb } from '../db'

/** Liveness + database reachability, for the container healthcheck. */
export default defineEventHandler(async () => {
  await useDb().execute(sql`select 1`)
  return { ok: true }
})
