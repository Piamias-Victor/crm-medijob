import { describe, expect, it, vi } from 'vitest'
import { runAppProfileCycle } from './run-cycle'
import { stubCycleDeps } from './run-cycle.test-deps'
import type { BadakanMission } from '@/server/badakan/map-mission'
import { EMPTY_BADAKAN_MISSION_DETAILS } from '@/server/badakan/map-mission-details'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

const mission: BadakanMission = {
  ...EMPTY_BADAKAN_MISSION_DETAILS,
  badakanId: 'm-hermes',
  pharmacyName: 'Pharmacie Hermes',
  enterpriseId: 'ent-hermes',
  step: 'CANCELLED',
  periods: [{ start: '2026-08-01', end: '2026-08-03' }],
  searchApplied: [],
}

describe('runAppProfileCycle Badakan missions', () => {
  it('pulls missions/search on the same periodic cycle', async () => {
    const syncMissions = vi.fn().mockResolvedValue({ fetched: 1, upserted: 1 })
    const result = await runAppProfileCycle(
      env,
      stubCycleDeps({
        client: { searchMissions: async () => [mission] },
        syncMissions,
      }),
    )
    expect(syncMissions).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({ missions: { fetched: 1, upserted: 1 } })
  })
})
