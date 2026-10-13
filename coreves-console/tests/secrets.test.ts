import { describe, expect, it } from 'vitest'
import { apiKeyMatches, generateApiKey, generateLoginCode, signWebhook, verifyWebhook } from '../server/utils/secrets'

describe('api keys', () => {
  it('matches only the issued key', () => {
    const { key, hash, prefix } = generateApiKey()
    expect(key.startsWith('cvk_')).toBe(true)
    expect(prefix).toBe(key.slice(0, 12))
    expect(apiKeyMatches(key, hash)).toBe(true)
    expect(apiKeyMatches(`${key}x`, hash)).toBe(false)
    expect(apiKeyMatches(generateApiKey().key, hash)).toBe(false)
  })
})

describe('lead webhook signature', () => {
  const secret = 's3cret'
  const body = '{"name":"Jane"}'
  const now = 1_800_000_000

  it('accepts a fresh, correctly signed body', () => {
    expect(verifyWebhook(secret, String(now), signWebhook(secret, now, body), body, now)).toBe('ok')
  })
  it('rejects a tampered body or wrong secret', () => {
    const sig = signWebhook(secret, now, body)
    expect(verifyWebhook(secret, String(now), sig, '{"name":"Eve"}', now)).toBe('bad-signature')
    expect(verifyWebhook('other', String(now), sig, body, now)).toBe('bad-signature')
    expect(verifyWebhook(secret, String(now), 'zz', body, now)).toBe('bad-signature')
  })
  it('rejects stale or missing timestamps (replay)', () => {
    const old = now - 301
    expect(verifyWebhook(secret, String(old), signWebhook(secret, old, body), body, now)).toBe('stale')
    expect(verifyWebhook(secret, undefined, 'x', body, now)).toBe('missing')
    expect(verifyWebhook('', String(now), 'x', body, now)).toBe('missing')
  })
})

describe('login codes', () => {
  it('are six digits', () => {
    for (let i = 0; i < 50; i++) expect(generateLoginCode()).toMatch(/^\d{6}$/)
  })
})
