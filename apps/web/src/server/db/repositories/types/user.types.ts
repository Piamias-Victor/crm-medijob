import type { UserRole } from '@/server/auth/permissions'

export type UserRecord = {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
}
