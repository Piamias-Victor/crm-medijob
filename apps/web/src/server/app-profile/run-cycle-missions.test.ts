import { describe, expect, it, vi } from 'vitest'
import { runAppProfileCycle, type AppProfileCycleDeps } from './run-cycle'
import type { BadakanMission } from '@/server/badakan/map-mission'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

const mission: BadakanMission = {
  badakanId: 'm-hermes',
  pharmacyName: 'Pharmacie Hermes',
  step: 'CANCELLED',
  periods: [{ start: '2026-08-01', end: '2026-08-03' }],
  searchApplied: [],
}

function cycleDeps(overrides: Partial<AppProfileCycleDeps> = {}): AppProfileCycleDeps {
  return {
    client: {
      searchNewEmployees: async () => [],
      searchEmployees: async () => [],
      searchMissions: async () => [mission],
      getRecipient: async () => null,
      getComments: async () => [],
    },
    findByBadakanIds: async () => [],
    upsertPending: async () => ({}),
    findJobTitleIdByName: async () => null,
    inviteDue: async () => ({
      sent: 0,
      skippedNoEmail: 0,
      cancelled: 0,
      failed: 0,
    }),
    syncValidated: async () => ({ created: 0, linked: 0, skipped: 0 }),
    syncMissions: async () => ({ fetched: 0, upserted: 0 }),
    ...overrides,
  }
}

describe('runAppProfileCycle Badakan missions', () => {
  it('pulls missions/search on the same periodic cycle', async () => {
    const syncMissions = vi.fn().mockResolvedValue({ fetched: 1, upserted: 1 })
    const result = await runAppProfileCycle(env, cycleDeps({ syncMissions }))
    expect(syncMissions).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({ missions: { fetched: 1, upserted: 1 } })
  })
})
