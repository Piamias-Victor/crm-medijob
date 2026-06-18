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
