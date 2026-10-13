import { describe, expect, it } from 'vitest'
import { addMonths, endOfDay, extendPaidThrough, invoiceNumber, nextPeriod, parseDay, periodFrom } from '../server/utils/billing'

describe('billing periods', () => {
  it('monthly and annual periods are inclusive', () => {
    expect(periodFrom('2026-11-01', 'MONTHLY')).toEqual({ periodStart: '2026-11-01', periodEnd: '2026-11-30' })
    expect(periodFrom('2026-11-15', 'MONTHLY')).toEqual({ periodStart: '2026-11-15', periodEnd: '2026-12-14' })
    expect(periodFrom('2026-01-01', 'ANNUAL')).toEqual({ periodStart: '2026-01-01', periodEnd: '2026-12-31' })
  })

  it('clamps month ends', () => {
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28')
    expect(addMonths('2028-01-31', 1)).toBe('2028-02-29')
    expect(addMonths('2026-12-15', 1)).toBe('2027-01-15')
  })

  it('next period starts the day after paid-through, or today when lapsed/never paid', () => {
    const paid = endOfDay('2026-11-30')
    expect(nextPeriod(paid, 'MONTHLY', '2026-11-25').periodStart).toBe('2026-12-01')
    expect(nextPeriod(paid, 'MONTHLY', '2027-02-10').periodStart).toBe('2027-02-10')
    expect(nextPeriod(null, 'MONTHLY', '2026-10-13')).toEqual({ periodStart: '2026-10-13', periodEnd: '2026-11-12' })
  })

  it('paid-through is the end of the day and never moves backwards', () => {
    expect(endOfDay('2026-11-30').toISOString()).toBe('2026-11-30T23:59:59.000Z')
    expect(extendPaidThrough(null, '2026-11-30').toISOString()).toBe('2026-11-30T23:59:59.000Z')
    expect(extendPaidThrough(endOfDay('2026-10-31'), '2026-11-30').toISOString()).toBe('2026-11-30T23:59:59.000Z')
    const later = endOfDay('2027-01-31')
    expect(extendPaidThrough(later, '2026-11-30')).toBe(later)
  })

  it('rejects malformed dates', () => {
    expect(() => parseDay('2026-02-30')).toThrow()
    expect(() => parseDay('13/10/2026')).toThrow()
  })

  it('numbers invoices per year', () => {
    expect(invoiceNumber(2026, 7)).toBe('CV-2026-0007')
    expect(invoiceNumber(2027, 12345)).toBe('CV-2027-12345')
  })
})
