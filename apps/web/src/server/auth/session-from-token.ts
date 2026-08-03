import type { Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import { USER_ROLES, type UserRole } from '@/server/auth/permissions'

function isUserRole(role: unknown): role is UserRole {
  return typeof role === 'string' && (USER_ROLES as readonly string[]).includes(role)
}

export function applyTokenToSession(session: Session, token: JWT): Session {
  if (typeof token.id === 'string') session.user.id = token.id
  if (isUserRole(token.role)) {
    session.user.role = token.role
  }
  return session
}
