import { useDb, schema } from '../../db'

export default defineEventHandler(async () => {
  const [s] = await useDb().select().from(schema.settings).limit(1)
  return s
})
