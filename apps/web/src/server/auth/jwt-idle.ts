import type { JWT } from 'next-auth/jwt'
import { evaluateIdleSession } from './idle-policy'

export function applyJwtIdle(input: {
  token: JWT
  now: number
  idleMs: number
  touch: boolean
}): JWT | null {
  const last =
    typeof input.token.lastActivity === 'number' ? input.token.lastActivity : input.now
  if (
    evaluateIdleSession({
      lastActivityAt: last,
      now: input.now,
      idleMs: input.idleMs,
    }) === 'expired'
  ) {
    return null
  }
  return {
    ...input.token,
    lastActivity: input.touch ? input.now : last,
  }
}
