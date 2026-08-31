import { describe, expect, it, vi } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { runAppProfileCycle, type AppProfileCycleDeps } from './run-cycle'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

const completed = mapBadakanRecipient({
  id: 'e1',
  firstName: 'Marie',
  lastName: 'App',
})!

const suspended = mapBadakanRecipient({
  id: 'bk-marie',
  firstName: 'Marie',
  lastName: 'App',
  status: 'SUSPENDED',
})!

function cycleDeps(overrides: Partial<AppProfileCycleDeps> = {}): AppProfileCycleDeps {
  return {
    client: {
      searchNewEmployees: async () => [],
      searchEmployees: async () => (completed ? [completed] : []),
      searchMissions: async () => [],
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
    probeInactive: async () => [],
    syncMissions: async () => ({ fetched: 0, upserted: 0 }),
    ...overrides,
  }
}

describe('runAppProfileCycle SUSPENDED', () => {
  it('feeds probed SUSPENDED recipients into syncValidated', async () => {
    const syncValidated = vi.fn().mockResolvedValue({
      created: 0,
      linked: 0,
      skipped: 1,
    })
    await runAppProfileCycle(
      env,
      cycleDeps({
        probeInactive: async () => [suspended!],
        syncValidated,
      }),
    )
    expect(syncValidated).toHaveBeenCalledWith([completed, suspended])
  })
})
