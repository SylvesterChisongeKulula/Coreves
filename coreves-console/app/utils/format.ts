export function money(amount: string | number | null | undefined, currency = 'ZMW'): string {
  if (amount === null || amount === undefined || amount === '') return '—'
  return `${currency} ${Number(amount).toLocaleString('en-ZM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function day(value: string | Date | null | undefined): string {
  if (!value) return '—'
  const d = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00Z`) : new Date(value)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

export function ago(value: string | Date | null | undefined): string {
  if (!value) return 'never'
  const mins = Math.round((Date.now() - new Date(value).getTime()) / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 48) return `${hours} h ago`
  return `${Math.round(hours / 24)} days ago`
}

export function errorMessage(e: unknown, fallback = 'Something went wrong'): string {
  const err = e as { data?: { statusMessage?: string, message?: string, data?: { issues?: { message: string }[] } }, statusMessage?: string }
  return err?.data?.data?.issues?.[0]?.message ?? err?.data?.statusMessage ?? err?.data?.message ?? err?.statusMessage ?? fallback
}

export const stateBadge: Record<string, string> = {
  ACTIVE: 'badge-green', GRACE: 'badge-amber', READ_ONLY: 'badge-red', UNPAID: 'badge-grey', CANCELLED: 'badge-grey',
  NEW: 'badge-blue', CONTACTED: 'badge-amber', DEMO: 'badge-amber', WON: 'badge-green', LOST: 'badge-grey',
  DRAFT: 'badge-grey', SENT: 'badge-blue', PAID: 'badge-green', VOID: 'badge-grey',
}

export function today(): string {
  return new Date().toISOString().slice(0, 10)
}
