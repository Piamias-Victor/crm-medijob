import { describe, expect, it, vi } from 'vitest'
import { makeAppProfileInviteRepository } from './app-profile-invite.repository'

describe('appProfileInviteRepository', () => {
  it('lists EN_ATTENTE profiles that have not been mailed', async () => {
    const findMany = vi.fn()
    const repo = makeAppProfileInviteRepository({
      appProfile: { findMany, update: vi.fn() },
    } as never)
    await repo.listDue()
    expect(findMany).toHaveBeenCalledWith({
      where: { status: 'EN_ATTENTE', inviteEmailSentAt: null },
      orderBy: { createdAt: 'asc' },
    })
  })
})
