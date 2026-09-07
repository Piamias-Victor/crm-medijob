import { describe, expect, it, vi } from 'vitest'
import { makeWeeklyAvailabilitySmsRepository } from './weekly-availability-sms.repo'
import { NOT_DELETED } from './soft-delete'

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
        status: { not: 'INACTIF' },
        badakanValidatedAt: { not: null },
        OR: [
          { weeklyAvailabilityToken: null },
          { weeklyAvailabilityToken: { smsSentAt: null } },
        ],
      },
      select: { id: true, firstName: true, phone: true, postalCode: true },
    })
  })
})
