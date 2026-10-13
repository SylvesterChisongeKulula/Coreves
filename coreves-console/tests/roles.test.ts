import { describe, expect, it } from 'vitest'
import { roleAllows } from '../server/utils/roles'

describe('roleAllows', () => {
  it('owner can do everything', () => {
    expect(roleAllows('OWNER', 'POST', '/api/admin/users')).toBe(true)
    expect(roleAllows('OWNER', 'PATCH', '/api/admin/settings')).toBe(true)
  })
  it('billing manages money and licences but not team or settings', () => {
    expect(roleAllows('BILLING', 'POST', '/api/admin/invoices/3/payments')).toBe(true)
    expect(roleAllows('BILLING', 'POST', '/api/admin/deployments/1/paid-through')).toBe(true)
    expect(roleAllows('BILLING', 'GET', '/api/admin/users')).toBe(false)
    expect(roleAllows('BILLING', 'PATCH', '/api/admin/settings')).toBe(false)
    expect(roleAllows('BILLING', 'GET', '/api/admin/settings')).toBe(true)
  })
  it('viewer is read-only and never sees the team', () => {
    expect(roleAllows('VIEWER', 'GET', '/api/admin/dashboard')).toBe(true)
    expect(roleAllows('VIEWER', 'GET', '/api/admin/deployments/1/licence')).toBe(true)
    expect(roleAllows('VIEWER', 'POST', '/api/admin/invoices/3/payments')).toBe(false)
    expect(roleAllows('VIEWER', 'GET', '/api/admin/users')).toBe(false)
  })
})
