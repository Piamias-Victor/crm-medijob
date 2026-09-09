import { describe, expect, it, vi } from 'vitest'
import { makeWeeklyAvailabilitySmsRepository } from './weekly-availability-sms.repo'
import { NOT_DELETED } from './soft-delete'
import { availabilitySmsReminderCutoff } from '@/view-models/weekly-availability-sms'

const dueSelect = { id: true, firstName: true, phone: true }

describe('weeklyAvailabilitySmsRepository listDue', () => {
  it('only lists APP Candidates stamped with badakanValidatedAt', async () => {
    const findMany = vi.fn().mockResolvedValue([])
    const repo = makeWeeklyAvailabilitySmsRepository({
      candidate: { findMany },
    } as never)
    await repo.listDue()
    expect(findMany).toHaveBeenCalledWith({
      where: {
        ...NOT_DELETED,
        origin: 'APP',
        status: { notIn: ['INACTIF', 'BLACKLISTE'] },
        badakanValidatedAt: { not: null },
        OR: [
          { weeklyAvailabilityToken: null },
          { weeklyAvailabilityToken: { smsSentAt: null } },
        ],
      },
      select: dueSelect,
    })
  })
})

describe('weeklyAvailabilitySmsRepository listReminderDue', () => {
  it('lists App-validated whose last SMS was at least 15 days ago', async () => {
    const findMany = vi.fn().mockResolvedValue([])
    const repo = makeWeeklyAvailabilitySmsRepository({
      candidate: { findMany },
    } as never)
    const now = new Date('2026-09-09T07:00:00.000Z')
    await repo.listReminderDue(now)
    expect(findMany).toHaveBeenCalledWith({
      where: {
        ...NOT_DELETED,
        origin: 'APP',
        status: { notIn: ['INACTIF', 'BLACKLISTE'] },
        badakanValidatedAt: { not: null },
        weeklyAvailabilityToken: { smsSentAt: { lte: availabilitySmsReminderCutoff(now) } },
      },
      select: dueSelect,
    })
  })
})
