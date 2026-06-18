import type { Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

export function applyTokenToSession(session: Session, token: JWT): Session {
  if (typeof token.id === 'string') session.user.id = token.id
  if (token.role === 'ADMIN' || token.role === 'RECRUTEUR') {
    session.user.role = token.role
  }
  return session
}
