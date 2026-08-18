import type { JWT } from 'next-auth/jwt'
import type { User } from 'next-auth'
import { applyJwtIdle } from '@/server/auth/jwt-idle'
import { getIdleTimeoutMs } from '@/server/auth/constants'

type JwtParams = {
  token: JWT
  user?: User
  trigger?: 'signIn' | 'signUp' | 'update'
}

export function applyAuthJwt({ token, user, trigger }: JwtParams): JWT | null {
  const now = Date.now()
  if (user) {
    token.id = user.id
    token.role = user.role
    token.lastActivity = now
  }
  return applyJwtIdle({
    token,
    now,
    idleMs: getIdleTimeoutMs(),
    touch: trigger === 'update' || Boolean(user),
  })
}
