import { describe, it, expect, vi, beforeEach } from 'vitest'
import { confirmPasswordReset, requestPasswordReset } from './reset-password'
import { makeResetDeps, validTokenRow } from './reset-password.test.fixtures'

describe('confirmPasswordReset', () => {
  beforeEach(() => vi.clearAllMocks())

  it('updates password when token is valid and unused', async () => {
    const deps = makeResetDeps({
      findToken: vi.fn().mockResolvedValue(validTokenRow),
      findUserByEmail: vi.fn().mockResolvedValue({ id: 'u1' }),
      updatePassword: vi.fn().mockResolvedValue(undefined),
      deleteToken: vi.fn().mockResolvedValue(undefined),
    })

    const result = await confirmPasswordReset(
      { token: 'raw-token', password: 'newpass12' },
      deps,
    )

    expect(result).toEqual({ ok: true })
    expect(deps.updatePassword).toHaveBeenCalledWith('u1', 'hashed:newpass12')
    expect(deps.deleteToken).toHaveBeenCalledWith({
      identifier: 'user@medijob.fr',
      token: 'tok:raw-token',
    })
  })

  it('rejects when token was already consumed', async () => {
    const deps = makeResetDeps({ findToken: vi.fn().mockResolvedValue(null) })
    await expect(
      confirmPasswordReset({ token: 'raw-token', password: 'newpass12' }, deps),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
    expect(deps.updatePassword).not.toHaveBeenCalled()
  })

  it('rejects when token is expired', async () => {
    const deps = makeResetDeps({
      findToken: vi.fn().mockResolvedValue({
        ...validTokenRow,
        expires: new Date('2026-08-01T11:00:00.000Z'),
      }),
    })
    await expect(
      confirmPasswordReset({ token: 'raw-token', password: 'newpass12' }, deps),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
    expect(deps.updatePassword).not.toHaveBeenCalled()
  })
})

describe('requestPasswordReset', () => {
  beforeEach(() => vi.clearAllMocks())

  it('creates token and sends email for a known user', async () => {
    const deps = makeResetDeps({
      findUserByEmail: vi.fn().mockResolvedValue({ id: 'u1' }),
      deleteTokensForEmail: vi.fn().mockResolvedValue(undefined),
      createToken: vi.fn().mockResolvedValue(undefined),
      sendResetEmail: vi.fn().mockResolvedValue(undefined),
    })

    expect(await requestPasswordReset({ email: 'User@Medijob.fr' }, deps)).toEqual({
      ok: true,
    })
    expect(deps.deleteTokensForEmail).toHaveBeenCalledWith('user@medijob.fr')
    expect(deps.createToken).toHaveBeenCalledWith({
      identifier: 'user@medijob.fr',
      token: 'tok:raw-token',
      expires: new Date('2026-08-01T13:00:00.000Z'),
    })
    expect(deps.sendResetEmail).toHaveBeenCalledWith({
      email: 'user@medijob.fr',
      resetUrl: 'http://localhost:3000/reset-password?token=raw-token',
    })
  })

  it('returns same ok without token or email when user unknown', async () => {
    const deps = makeResetDeps({
      findUserByEmail: vi.fn().mockResolvedValue(null),
    })
    expect(await requestPasswordReset({ email: 'ghost@medijob.fr' }, deps)).toEqual({
      ok: true,
    })
    expect(deps.createToken).not.toHaveBeenCalled()
    expect(deps.sendResetEmail).not.toHaveBeenCalled()
  })
})
