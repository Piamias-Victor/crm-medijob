import type { DefaultSession } from 'next-auth'
import type { UserRole } from '@/server/auth/permissions'

declare module 'next-auth' {
  interface User {
    role: UserRole
  }

  interface Session {
    user: { id: string; role: UserRole } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: UserRole
    lastActivity?: number
  }
}
