import { describe, it, expect } from 'vitest'
import type { Session } from 'next-auth'
import { applyTokenToSession } from '@/server/auth/session-from-token'

function baseSession(): Session {
  return {
    user: { name: 'Admin', email: 'admin@medijob.fr' } as Session['user'],
    expires: '2099-01-01',
  }
}

describe('applyTokenToSession', () => {
  it('maps ADMIN role from JWT token to session user (middleware gate)', () => {
    const session = applyTokenToSession(baseSession(), {
      sub: 'u1',
      id: 'u1',
      role: 'ADMIN',
    })

    expect(session.user.role).toBe('ADMIN')
    expect(session.user.id).toBe('u1')
  })

  it('leaves role unset when token has no role', () => {
    const session = applyTokenToSession(baseSession(), { sub: 'u1' })

    expect(session.user.role).toBeUndefined()
  })
})
