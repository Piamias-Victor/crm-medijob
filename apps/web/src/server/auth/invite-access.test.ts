// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { sendAccessInvite } from './invite-access'
import type { InviteAccessDeps } from './invite-access'

function makeDeps(overrides: Partial<InviteAccessDeps> = {}): InviteAccessDeps {
  return {
    deleteTokensForEmail: vi.fn().mockResolvedValue(undefined),
    createToken: vi.fn().mockResolvedValue(undefined),
    hashToken: (raw) => `hash:${raw}`,
    createRawToken: () => 'raw-invite-token',
    sendResetEmail: vi.fn(),
    sendInviteEmail: vi.fn().mockResolvedValue(undefined),
    resetTokenTtlMs: 60_000,
    appBaseUrl: 'https://crm.example',
    now: () => new Date('2026-09-06T10:00:00.000Z'),
    ...overrides,
  }
}

describe('sendAccessInvite', () => {
  it('emails an activation link for the new account', async () => {
    const deps = makeDeps()
    await sendAccessInvite('Jane@Medijob.fr', deps)
    expect(deps.deleteTokensForEmail).toHaveBeenCalledWith('jane@medijob.fr')
    expect(deps.createToken).toHaveBeenCalledWith({
      identifier: 'jane@medijob.fr',
      token: 'hash:raw-invite-token',
      expires: new Date('2026-09-06T10:01:00.000Z'),
    })
    expect(deps.sendInviteEmail).toHaveBeenCalledWith({
      email: 'jane@medijob.fr',
      resetUrl: 'https://crm.example/reset-password?token=raw-invite-token',
    })
  })
})
