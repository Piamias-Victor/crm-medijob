import { describe, expect, it, vi } from 'vitest'
import { makeBadakanContractSmsRepository } from './badakan-contract-sms.repo'
import { NOT_DELETED } from './soft-delete'
import { contractSignSmsReminderCutoff } from '@/view-models/badakan-contract-sms'

const contractSelect = { id: true, recipientId: true } as const
const candidateSelect = { id: true, badakanId: true, phone: true } as const
const smsExcludedStatus = ['INACTIF', 'BLACKLISTE']

describe('badakanContractSmsRepository listDue', () => {
  it('lists new CREATED contracts linked to a Candidate who can receive SMS', async () => {
    const findMany = vi.fn().mockResolvedValueOnce([]).mockResolvedValueOnce([]).mockResolvedValue([])
    const repo = makeBadakanContractSmsRepository({
      badakanContract: { findMany },
      candidate: { findMany },
    } as never)
    await repo.listDue()
    expect(findMany).toHaveBeenCalledWith({
      where: {
        status: 'CREATED',
        signInviteSmsSentAt: null,
        recipientId: { not: null },
      },
      select: contractSelect,
    })
  })

  it('lists CREATED contracts whose first SMS was at least 24h ago', async () => {
    const findMany = vi.fn().mockResolvedValue([])
    const repo = makeBadakanContractSmsRepository({
      badakanContract: { findMany },
      candidate: { findMany },
    } as never)
    const now = new Date('2026-09-10T12:00:00.000Z')
    await repo.listDue(now)
    expect(findMany).toHaveBeenCalledWith({
      where: {
        status: 'CREATED',
        signInviteSmsSentAt: { lte: contractSignSmsReminderCutoff(now) },
        signInviteReminderSentAt: null,
        recipientId: { not: null },
      },
      select: contractSelect,
    })
  })
})

describe('badakanContractSmsRepository attach', () => {
  it('drops Inactif, Blacklisté, and unknown recipients', async () => {
    const contractFindMany = vi
      .fn()
      .mockResolvedValueOnce([{ id: 'row1', recipientId: 'bk-marie' }])
      .mockResolvedValueOnce([])
    const candidateFindMany = vi.fn().mockResolvedValue([
      { id: 'c1', badakanId: 'bk-marie', phone: '0612345678' },
    ])
    const repo = makeBadakanContractSmsRepository({
      badakanContract: { findMany: contractFindMany },
      candidate: { findMany: candidateFindMany },
    } as never)
    const rows = await repo.listDue()
    expect(candidateFindMany).toHaveBeenCalledWith({
      where: {
        ...NOT_DELETED,
        badakanId: { in: ['bk-marie'] },
        status: { notIn: smsExcludedStatus },
      },
      select: candidateSelect,
    })
    expect(rows).toEqual([
      { contractId: 'row1', candidateId: 'c1', phone: '0612345678', kind: 'first' },
    ])
  })
})
