import type { DefaultSession } from 'next-auth'

type AppRole = 'RECRUTEUR' | 'ADMIN'

declare module 'next-auth' {
  interface User {
    role: AppRole
  }

  interface Session {
    user: { id: string; role: AppRole } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: AppRole
    lastActivity?: number
  }
}
