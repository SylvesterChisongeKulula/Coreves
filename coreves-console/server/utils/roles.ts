export type Role = 'OWNER' | 'BILLING' | 'VIEWER'

/**
 * Single source of truth for who may call which admin API.
 *   OWNER   — everything
 *   BILLING — everything except team (users) and company settings writes
 *   VIEWER  — read-only, and never the team list
 */
export function roleAllows(role: Role, method: string, path: string): boolean {
  if (role === 'OWNER') return true
  const isRead = method === 'GET' || method === 'HEAD'
  if (path.startsWith('/api/admin/users')) return false
  if (path.startsWith('/api/admin/settings')) return isRead
  if (role === 'BILLING') return true
  return isRead
}
