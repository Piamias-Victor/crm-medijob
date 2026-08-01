import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeAuthResetRouter } from '@/server/routers/auth-reset'
import { makeResetDeps, validTokenRow } from '@/server/auth/reset-password.test.fixtures'

describe('authResetRouter', () => {
  beforeEach(() => vi.clearAllMocks())

  it('requestPasswordReset returns ok for unknown email', async () => {
    const deps = makeResetDeps({
      findUserByEmail: vi.fn().mockResolvedValue(null),
    })
    const caller = createCallerFactory(makeAuthResetRouter(deps))({ session: null })
    await expect(
      caller.requestPasswordReset({ email: 'ghost@medijob.fr' }),
    ).resolves.toEqual({ ok: true })
  })

  it('confirmPasswordReset rejects a reused token', async () => {
    const deps = makeResetDeps({
      findToken: vi.fn().mockResolvedValue(null),
    })
    const caller = createCallerFactory(makeAuthResetRouter(deps))({ session: null })
    await expect(
      caller.confirmPasswordReset({ token: 'raw-token', password: 'newpass12' }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
  })

  it('confirmPasswordReset accepts a valid token', async () => {
    const deps = makeResetDeps({
      findToken: vi.fn().mockResolvedValue(validTokenRow),
      findUserByEmail: vi.fn().mockResolvedValue({ id: 'u1' }),
      updatePassword: vi.fn().mockResolvedValue(undefined),
      deleteToken: vi.fn().mockResolvedValue(undefined),
    })
    const caller = createCallerFactory(makeAuthResetRouter(deps))({ session: null })
    await expect(
      caller.confirmPasswordReset({ token: 'raw-token', password: 'newpass12' }),
    ).resolves.toEqual({ ok: true })
  })
})
