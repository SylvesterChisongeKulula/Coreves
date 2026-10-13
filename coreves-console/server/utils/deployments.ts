import type { schema } from '../db'

type Deployment = typeof schema.deployments.$inferSelect

/** Deployment as sent to the browser — never includes the API key hash. */
export function publicDeployment(d: Deployment) {
  const { apiKeyHash: _hash, ...rest } = d
  return { ...rest, state: accessState(d.paidThrough, d.graceDays, new Date(), d.cancelledAt) }
}

/** Mirrors CoreVesFin's effective status so the console shows what the client sees. */
export function accessState(paidThrough: Date | null, graceDays: number, now: Date, cancelledAt?: Date | null) {
  if (cancelledAt) return 'CANCELLED' as const
  if (!paidThrough) return 'UNPAID' as const
  if (now < paidThrough) return 'ACTIVE' as const
  return now.getTime() < paidThrough.getTime() + graceDays * 86_400_000 ? 'GRACE' as const : 'READ_ONLY' as const
}
