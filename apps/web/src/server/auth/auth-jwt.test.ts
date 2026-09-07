import { describe, expect, it } from 'vitest'
import { applyAuthJwt } from '@/server/auth/auth-jwt'

describe('applyAuthJwt', () => {
  it('expires idle token so Edge middleware logs out like Node auth', () => {
    expect(applyAuthJwt({ token: { lastActivity: 0 } })).toBeNull()
  })

  it('keeps a session after 31 minutes of clock time', () => {
    const token = applyAuthJwt({
      token: { lastActivity: Date.now() - 31 * 60_000, id: 'u1' },
    })
    expect(token).toMatchObject({ id: 'u1' })
  })

  it('expires a session after 24 hours', () => {
    expect(
      applyAuthJwt({
        token: { lastActivity: Date.now() - 24 * 60 * 60_000 - 1 },
      }),
    ).toBeNull()
  })
})
