import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

// ── Deployment API keys ──────────────────────────────────────────────────────
// Shown once at creation; only the SHA-256 hash is stored. The prefix (first
// characters after "cvk_") is kept so a key can be recognised in the UI.

export function generateApiKey(): { key: string, hash: string, prefix: string } {
  const key = `cvk_${randomBytes(24).toString('base64url')}`
  return { key, hash: hashApiKey(key), prefix: key.slice(0, 12) }
}

export function hashApiKey(key: string): string {
  return createHash('sha256').update(key, 'utf8').digest('hex')
}

export function apiKeyMatches(presented: string, storedHash: string): boolean {
  const a = Buffer.from(hashApiKey(presented), 'hex')
  const b = Buffer.from(storedHash, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}

// ── Website → console lead webhook ───────────────────────────────────────────
// Signature = hex HMAC-SHA256(secret, `${timestamp}.${rawBody}`); timestamp in
// epoch seconds, rejected when more than 5 minutes from now (replay window).

export const WEBHOOK_TOLERANCE_SECONDS = 300

export function signWebhook(secret: string, timestamp: number, rawBody: string): string {
  return createHmac('sha256', secret).update(`${timestamp}.${rawBody}`, 'utf8').digest('hex')
}

export function verifyWebhook(
  secret: string,
  timestampHeader: string | undefined,
  signatureHeader: string | undefined,
  rawBody: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): 'ok' | 'missing' | 'stale' | 'bad-signature' {
  if (!secret || !timestampHeader || !signatureHeader) return 'missing'
  const ts = Number(timestampHeader)
  if (!Number.isInteger(ts) || Math.abs(nowSeconds - ts) > WEBHOOK_TOLERANCE_SECONDS) return 'stale'
  const expected = Buffer.from(signWebhook(secret, ts, rawBody), 'hex')
  const given = Buffer.from(signatureHeader, 'hex')
  return expected.length === given.length && timingSafeEqual(expected, given) ? 'ok' : 'bad-signature'
}

// ── Login codes (email 2FA) ──────────────────────────────────────────────────

export function generateLoginCode(): string {
  return String(randomBytes(4).readUInt32BE() % 1_000_000).padStart(6, '0')
}

export function hashLoginCode(code: string, userId: number): string {
  return createHash('sha256').update(`${userId}:${code}`, 'utf8').digest('hex')
}
