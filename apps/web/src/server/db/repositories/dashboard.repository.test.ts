import { describe, expect, it, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import { makeDashboardRepository } from './dashboard.repository'

describe('makeDashboardRepository getOverview', () => {
  it('returns counts used on the home dashboard', async () => {
    const count = vi.fn()
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2)
    const db = {
      candidate: { count },
      pharmacy: { count },
      mission: { count },
      application: { count: vi.fn().mockResolvedValue(4) },
    } as unknown as PrismaClient

    const overview = await makeDashboardRepository(db).getOverview()

    expect(overview).toEqual({
      candidates: 10,
      pharmacies: 5,
      missionsActive: 3,
      inboxPending: 4,
    })
    expect(count).toHaveBeenCalledTimes(3)
  })
})
