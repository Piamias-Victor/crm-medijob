// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { assembleWeekReportStats } from '@/server/ai/week-report-assemble'
import type { WeekReportCountsLoader } from '@/server/ai/week-report-assemble'

function loader(overrides: Partial<WeekReportCountsLoader> = {}): WeekReportCountsLoader {
  return {
    countOpenMissions: vi.fn().mockResolvedValue(3),
    countFilledMissions: vi.fn().mockResolvedValue(1),
    countCandidatesContacted: vi.fn().mockResolvedValue(4),
    countApplicationsReceived: vi.fn().mockResolvedValue(2),
    countOffersPublished: vi.fn().mockResolvedValue(1),
    countCommercialActions: vi.fn().mockResolvedValue(5),
    ...overrides,
  }
}

describe('assembleWeekReportStats', () => {
  it('loads referent-scoped counts for the ISO week containing now', async () => {
    const counts = loader()
    const now = new Date('2026-08-05T12:30:00.000Z')
    const stats = await assembleWeekReportStats(counts, { referentId: 'u1', now })

    expect(stats).toEqual({
      referentId: 'u1',
      from: new Date('2026-08-02T22:00:00.000Z'),
      to: new Date('2026-08-09T22:00:00.000Z'),
      missionsOpen: 3,
      missionsFilled: 1,
      candidatesContacted: 4,
      applicationsReceived: 2,
      offersPublished: 1,
      commercialActions: 5,
    })

    const range = {
      referentId: 'u1',
      from: stats.from,
      to: stats.to,
    }
    expect(counts.countOpenMissions).toHaveBeenCalledWith({ referentId: 'u1' })
    expect(counts.countFilledMissions).toHaveBeenCalledWith(range)
    expect(counts.countCandidatesContacted).toHaveBeenCalledWith(range)
    expect(counts.countApplicationsReceived).toHaveBeenCalledWith(range)
    expect(counts.countOffersPublished).toHaveBeenCalledWith(range)
    expect(counts.countCommercialActions).toHaveBeenCalledWith(range)
  })
})
