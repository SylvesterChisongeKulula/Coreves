import { createPrivateKey, createPublicKey, sign, verify, type KeyObject } from 'node:crypto'

/**
 * CoreVesFin licence tokens — compact EdDSA (Ed25519) JWS.
 *
 * The format must stay in step with corevesfin's `scripts/licence/LicenceTool.java`
 * (issuer) and `LicenceVerifier.java` (what every client deployment runs):
 * header {"alg":"EdDSA","typ":"JWT"}; claims sub, customer, domain, plan,
 * paidThrough (ISO-8601 string), graceDays (int), iat (epoch seconds).
 */
export interface LicenceClaims {
  sub: string
  customer: string
  domain: string
  plan: 'MONTHLY' | 'ANNUAL'
  paidThrough: string
  graceDays: number
  iat: number
}

export interface LicenceInput {
  deploymentSlug: string
  customer: string
  domain: string
  plan: 'MONTHLY' | 'ANNUAL'
  paidThrough: Date
  graceDays: number
  issuedAt?: Date
}

const HEADER = { alg: 'EdDSA', typ: 'JWT' }

function b64url(data: Buffer | string): string {
  return Buffer.from(data).toString('base64url')
}

/** Java's Instant.toString(): no millisecond part when it is zero. */
export function isoInstant(d: Date): string {
  return d.toISOString().replace('.000Z', 'Z')
}

export function parsePrivateKey(pem: string): KeyObject {
  const key = createPrivateKey(pem.replace(/\\n/g, '\n'))
  if (key.asymmetricKeyType !== 'ed25519') throw new Error('LICENCE_PRIVATE_KEY is not an Ed25519 key')
  return key
}

export function signLicence(input: LicenceInput, privateKey: KeyObject): { token: string, claims: LicenceClaims } {
  const claims: LicenceClaims = {
    sub: input.deploymentSlug,
    customer: input.customer,
    domain: input.domain.toLowerCase(),
    plan: input.plan,
    paidThrough: isoInstant(input.paidThrough),
    graceDays: input.graceDays,
    iat: Math.floor((input.issuedAt ?? new Date()).getTime() / 1000),
  }
  const signingInput = `${b64url(JSON.stringify(HEADER))}.${b64url(JSON.stringify(claims))}`
  const signature = sign(null, Buffer.from(signingInput, 'ascii'), privateKey)
  return { token: `${signingInput}.${b64url(signature)}`, claims }
}

/** Decode + verify against the matching public key — used for self-checks and tests. */
export function verifyLicence(token: string, publicKey: KeyObject): LicenceClaims | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [h, p, s] = parts as [string, string, string]
  const ok = verify(null, Buffer.from(`${h}.${p}`, 'ascii'), publicKey, Buffer.from(s, 'base64url'))
  if (!ok) return null
  return JSON.parse(Buffer.from(p, 'base64url').toString('utf8')) as LicenceClaims
}

export function publicKeyOf(privateKey: KeyObject): KeyObject {
  return createPublicKey(privateKey)
}
