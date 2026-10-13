import type { KeyObject } from 'node:crypto'
import { desc, eq } from 'drizzle-orm'
import type { Db, Tx } from '../db'
import { schema } from '../db'

let signingKey: KeyObject | undefined

/** The Ed25519 private key every CoreVesFin image's bundled public key trusts. */
export function useSigningKey(): KeyObject {
  if (!signingKey) {
    const pem = useRuntimeConfig().licencePrivateKey
    if (!pem) throw createError({ statusCode: 500, statusMessage: 'LICENCE_PRIVATE_KEY is not configured' })
    signingKey = parsePrivateKey(pem)
  }
  return signingKey
}

type Deployment = typeof schema.deployments.$inferSelect
type Licence = typeof schema.licences.$inferSelect

export async function latestLicence(db: Db | Tx, deploymentId: number): Promise<Licence | undefined> {
  const [row] = await db.select().from(schema.licences)
    .where(eq(schema.licences.deploymentId, deploymentId))
    .orderBy(desc(schema.licences.issuedAt), desc(schema.licences.id)).limit(1)
  return row
}

/** True when the newest licence no longer reflects the deployment's entitlement. */
export function licenceIsStale(d: Deployment, latest: Licence | undefined): boolean {
  if (!d.paidThrough) return false // never paid → nothing to issue
  if (!latest) return true
  return latest.paidThrough.getTime() !== d.paidThrough.getTime()
    || latest.graceDays !== d.graceDays
    || latest.domain !== d.domain.toLowerCase()
}

/** Sign + store a licence reflecting the deployment's current paid-through. */
export async function issueLicence(
  db: Db | Tx,
  d: Deployment,
  customerName: string,
  issuedBy: number | null,
  reason: string,
): Promise<Licence> {
  if (!d.paidThrough) throw createError({ statusCode: 422, statusMessage: 'Deployment has no paid-through date yet' })
  const issuedAt = new Date()
  const { token } = signLicence({
    deploymentSlug: d.slug,
    customer: customerName,
    domain: d.domain,
    plan: d.plan,
    paidThrough: d.paidThrough,
    graceDays: d.graceDays,
    issuedAt,
  }, useSigningKey())
  const [row] = await db.insert(schema.licences).values({
    deploymentId: d.id,
    token,
    domain: d.domain.toLowerCase(),
    paidThrough: d.paidThrough,
    graceDays: d.graceDays,
    issuedAt,
    issuedBy,
    reason,
  }).returning()
  await audit(db, issuedBy, 'licence.issue', 'deployment', d.id,
    { paidThrough: d.paidThrough.toISOString(), reason })
  return row!
}
