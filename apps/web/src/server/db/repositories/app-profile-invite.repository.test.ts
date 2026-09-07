import { describe, expect, it, vi } from 'vitest'
import { makeAppProfileInviteRepository } from './app-profile-invite.repository'

describe('appProfileInviteRepository', () => {
  it('lists profiles that have not been mailed except IGNORE', async () => {
    const findMany = vi.fn()
    const repo = makeAppProfileInviteRepository({
      appProfile: { findMany, update: vi.fn() },
    } as never)
    await repo.listDue()
    expect(findMany).toHaveBeenCalledWith({
      where: { status: { not: 'IGNORE' }, inviteEmailSentAt: null },
      orderBy: { createdAt: 'asc' },
    })
  })
})
