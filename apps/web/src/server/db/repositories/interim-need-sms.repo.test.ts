import { describe, expect, it, vi } from 'vitest'
import { makeInterimNeedSmsRepository } from './interim-need-sms.repo'
import { NOT_DELETED } from './soft-delete'

describe('interimNeedSmsRepository listCandidates', () => {
  it('lists App-validated Candidates who are not Inactif or Blacklisté', async () => {
    const findMany = vi.fn().mockResolvedValue([])
    const repo = makeInterimNeedSmsRepository({
      candidate: { findMany },
    } as never)
    await repo.listCandidates()
    expect(findMany).toHaveBeenCalledWith({
      where: {
        ...NOT_DELETED,
        origin: 'APP',
        status: { notIn: ['INACTIF', 'BLACKLISTE'] },
        badakanValidatedAt: { not: null },
      },
      select: {
        id: true,
        jobTitleId: true,
        phone: true,
        latitude: true,
        longitude: true,
        postalCode: true,
        interimNeedSmsSentAt: true,
      },
    })
  })
})

describe('interimNeedSmsRepository listOpenNeeds', () => {
  it('lists CREATED Badakan missions with a JobTitle', async () => {
    const findMany = vi.fn().mockResolvedValue([])
    const repo = makeInterimNeedSmsRepository({
      badakanMission: { findMany },
    } as never)
    await repo.listOpenNeeds()
    expect(findMany).toHaveBeenCalledWith({
      where: {
        step: 'CREATED',
        jobTitleId: { not: null },
      },
      select: {
        jobTitleId: true,
        createdAt: true,
        latitude: true,
        longitude: true,
        postalCode: true,
        expectedRecipients: true,
        staffedRecipients: true,
      },
    })
  })

  it('keeps only open needs', async () => {
    const findMany = vi.fn().mockResolvedValue([
      {
        jobTitleId: 'jt-prep',
        createdAt: new Date('2026-09-08'),
        latitude: 48.8,
        longitude: 2.3,
        expectedRecipients: 2,
        staffedRecipients: 1,
      },
      {
        jobTitleId: 'jt-prep',
        createdAt: new Date('2026-09-08'),
        latitude: 48.8,
        longitude: 2.3,
        expectedRecipients: 1,
        staffedRecipients: 1,
      },
    ])
    const repo = makeInterimNeedSmsRepository({
      badakanMission: { findMany },
    } as never)
    const rows = await repo.listOpenNeeds()
    expect(rows).toHaveLength(1)
    expect(rows[0]?.jobTitleId).toBe('jt-prep')
  })
})
