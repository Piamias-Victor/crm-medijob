// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { restoreCandidateSlotsOnMission } from './proposal-held-slots'

describe('restoreCandidateSlotsOnMission', () => {
  it('falls back to mission dates when no held slots exist', async () => {
    const upsertWeek = vi.fn().mockResolvedValue({ id: 'w1' })
    const upsertSlot = vi.fn().mockResolvedValue({})
    const db = {
      badakanProposalHeldSlot: {
        findMany: vi.fn().mockResolvedValue([]),
        deleteMany: vi.fn(),
      },
      badakanMission: {
        findUnique: vi.fn().mockResolvedValue({
          periods: [{ start: '2026-09-12', end: '2026-09-12' }],
        }),
      },
      weeklyAvailabilityWeek: { upsert: upsertWeek },
      weeklyAvailabilitySlot: { upsert: upsertSlot },
    }
    await restoreCandidateSlotsOnMission(db as never, 'c1', 'm1')
    expect(upsertSlot).toHaveBeenCalledTimes(2)
  })
})
