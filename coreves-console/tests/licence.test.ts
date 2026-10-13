import { generateKeyPairSync } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { isoInstant, parsePrivateKey, publicKeyOf, signLicence, verifyLicence } from '../server/utils/licence'

const { privateKey } = generateKeyPairSync('ed25519')
const pem = privateKey.export({ type: 'pkcs8', format: 'pem' }) as string
const key = parsePrivateKey(pem)

const input = {
  deploymentSlug: 'acme-loans',
  customer: 'Acme "Q" Lending',
  domain: 'App.AcmeLending.co.zm',
  plan: 'MONTHLY' as const,
  paidThrough: new Date('2026-11-30T23:59:59Z'),
  graceDays: 7,
  issuedAt: new Date('2026-10-13T08:00:00Z'),
}

describe('licence', () => {
  it('produces the LicenceTool header and claim set', () => {
    const { token } = signLicence(input, key)
    const [h, p] = token.split('.')
    expect(JSON.parse(Buffer.from(h!, 'base64url').toString())).toEqual({ alg: 'EdDSA', typ: 'JWT' })
    expect(JSON.parse(Buffer.from(p!, 'base64url').toString())).toEqual({
      sub: 'acme-loans',
      customer: 'Acme "Q" Lending',
      domain: 'app.acmelending.co.zm',
      plan: 'MONTHLY',
      paidThrough: '2026-11-30T23:59:59Z',
      graceDays: 7,
      iat: 1791878400,
    })
  })

  it('verifies with the matching public key and rejects tampering or another key', () => {
    const { token } = signLicence(input, key)
    expect(verifyLicence(token, publicKeyOf(key))?.sub).toBe('acme-loans')

    const [h, p, s] = token.split('.') as [string, string, string]
    const forged = Buffer.from(Buffer.from(p, 'base64url').toString().replace('2026-11-30', '2099-11-30')).toString('base64url')
    expect(verifyLicence(`${h}.${forged}.${s}`, publicKeyOf(key))).toBeNull()

    const other = generateKeyPairSync('ed25519').publicKey
    expect(verifyLicence(token, other)).toBeNull()
  })

  it('accepts a PEM with escaped newlines (single-line env var)', () => {
    expect(() => parsePrivateKey(pem.replace(/\n/g, '\\n'))).not.toThrow()
  })

  it('rejects a non-Ed25519 key', () => {
    const rsa = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs8', format: 'pem' }) as string
    expect(() => parsePrivateKey(rsa)).toThrow(/Ed25519/)
  })

  it('formats instants like Java Instant.toString()', () => {
    expect(isoInstant(new Date('2026-01-01T00:00:00.000Z'))).toBe('2026-01-01T00:00:00Z')
    expect(isoInstant(new Date('2026-01-01T00:00:00.250Z'))).toBe('2026-01-01T00:00:00.250Z')
  })
})
