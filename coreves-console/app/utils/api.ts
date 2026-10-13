interface ApiOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
  query?: Record<string, unknown>
}

/**
 * $fetch for the console's own API with a plain-string URL. Nitro's typed-route
 * inference exceeds TypeScript's stack depth once there are this many routes, so
 * mutations go through here and declare their response type explicitly.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function api<T = any>(url: string, opts: ApiOptions = {}): Promise<T> {
  return ($fetch as unknown as (u: string, o: ApiOptions) => Promise<T>)(url, opts)
}
