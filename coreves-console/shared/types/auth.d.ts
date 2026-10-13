declare module '#auth-utils' {
  interface User {
    id: number
    email: string
    name: string
    role: 'OWNER' | 'BILLING' | 'VIEWER'
  }
  interface UserSession {
    /** Set after a correct password, before the emailed code is verified. */
    pendingUserId?: number
  }
}
export {}
