import { describe, expect, it } from 'vitest'
import { applyAuthJwt } from '@/server/auth/auth-jwt'

describe('applyAuthJwt', () => {
  it('expires idle token so Edge middleware logs out like Node auth', () => {
    expect(applyAuthJwt({ token: { lastActivity: 0 } })).toBeNull()
  })
})
