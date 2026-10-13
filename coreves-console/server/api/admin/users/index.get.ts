import { asc } from 'drizzle-orm'
import { useDb, schema } from '../../../db'

export default defineEventHandler(async () => {
  return useDb().select({
    id: schema.users.id, email: schema.users.email, name: schema.users.name,
    role: schema.users.role, active: schema.users.active, createdAt: schema.users.createdAt,
  }).from(schema.users).orderBy(asc(schema.users.name))
})
