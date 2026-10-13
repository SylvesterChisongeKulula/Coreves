import type { Db, Tx } from '../db'
import { schema } from '../db'

export async function audit(
  db: Db | Tx,
  userId: number | null,
  action: string,
  entity: string,
  entityId: number | null,
  detail?: Record<string, unknown>,
) {
  await db.insert(schema.auditLog).values({ userId, action, entity, entityId, detail: detail ?? null })
}
