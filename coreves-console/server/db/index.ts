import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

let client: ReturnType<typeof postgres> | undefined
let instance: ReturnType<typeof drizzle<typeof schema>> | undefined

/** Lazily-created Drizzle client (one pool per server process). */
export function useDb() {
  if (!instance) {
    const url = useRuntimeConfig().databaseUrl
    if (!url) throw new Error('DATABASE_URL is not set')
    client = postgres(url, { max: 10, onnotice: () => {} }) // silence 'already exists' notices from migrations
    instance = drizzle(client, { schema })
  }
  return instance
}

export type Db = ReturnType<typeof useDb>
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0]
export { schema }
