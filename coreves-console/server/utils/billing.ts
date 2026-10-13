/**
 * Billing period + paid-through maths. Dates are calendar days ('YYYY-MM-DD', UTC);
 * paid-through is an instant at the END of its day (23:59:59Z), matching what
 * LicenceTool issues for `--paid-through <date>`.
 */

export type Plan = 'MONTHLY' | 'ANNUAL'

const DAY_MS = 86_400_000

export function toDay(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function parseDay(day: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error(`Invalid date '${day}' (expected YYYY-MM-DD)`)
  const d = new Date(`${day}T00:00:00Z`)
  if (Number.isNaN(d.getTime()) || toDay(d) !== day) throw new Error(`Invalid date '${day}'`)
  return d
}

export function addDays(day: string, n: number): string {
  return toDay(new Date(parseDay(day).getTime() + n * DAY_MS))
}

/** Add months, clamping to the target month's last day (Jan 31 + 1 → Feb 28/29). */
export function addMonths(day: string, n: number): string {
  const d = parseDay(day)
  const y = d.getUTCFullYear()
  const m = d.getUTCMonth() + n
  const lastDay = new Date(Date.UTC(y, m + 1, 0)).getUTCDate()
  return toDay(new Date(Date.UTC(y, m, Math.min(d.getUTCDate(), lastDay))))
}

/** End-of-day instant for a calendar day: the licence's paidThrough. */
export function endOfDay(day: string): Date {
  return new Date(parseDay(day).getTime() + DAY_MS - 1000)
}

/** Billing period that starts on `start`: one month or twelve months, inclusive. */
export function periodFrom(start: string, plan: Plan): { periodStart: string, periodEnd: string } {
  const months = plan === 'ANNUAL' ? 12 : 1
  return { periodStart: start, periodEnd: addDays(addMonths(start, months), -1) }
}

/**
 * The next period to invoice: the day after the current paid-through, or — for a
 * deployment that has never been paid or has lapsed — `today`.
 */
export function nextPeriod(paidThrough: Date | null, plan: Plan, today: string): { periodStart: string, periodEnd: string } {
  const afterPaid = paidThrough ? addDays(toDay(paidThrough), 1) : null
  const start = afterPaid && afterPaid >= today ? afterPaid : today
  return periodFrom(start, plan)
}

/** Paying an invoice never shortens access: take the later of the two. */
export function extendPaidThrough(current: Date | null, periodEnd: string): Date {
  const candidate = endOfDay(periodEnd)
  return current && current.getTime() > candidate.getTime() ? current : candidate
}

export function invoiceNumber(year: number, sequence: number): string {
  return `CV-${year}-${String(sequence).padStart(4, '0')}`
}

/** Money is held as numeric strings ('1000.00') end to end — never floats. */
export function formatMoney(amount: string | number, currency: string): string {
  const n = typeof amount === 'number' ? amount : Number(amount)
  return `${currency} ${n.toLocaleString('en-ZM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
