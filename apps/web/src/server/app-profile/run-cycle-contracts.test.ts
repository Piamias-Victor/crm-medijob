import { describe, expect, it, vi } from 'vitest'
import { runAppProfileCycle, type AppProfileCycleDeps } from './run-cycle'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

function cycleDeps(overrides: Partial<AppProfileCycleDeps> = {}): AppProfileCycleDeps {
  return {
    client: {
      searchNewEmployees: async () => [],
      searchEmployees: async () => [],
      searchMissions: async () => [],
      searchContracts: async () => [],
      getRecipient: async () => null,
      getComments: async () => [],
      getEnterprise: async () => null,
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
    syncEnterprises: async () => ({ fetched: 0, upserted: 0 }),
    syncContracts: async () => ({ fetched: 0, upserted: 0 }),
    smsDue: async () => ({ sent: 0, skippedNoPhone: 0, failed: 0 }),
    ...overrides,
  }
}

describe('runAppProfileCycle Badakan contracts', () => {
  it('pulls contracts/search on the same periodic cycle', async () => {
    const syncContracts = vi.fn().mockResolvedValue({ fetched: 1, upserted: 1 })
    const result = await runAppProfileCycle(env, cycleDeps({ syncContracts }))
    expect(syncContracts).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({ contracts: { fetched: 1, upserted: 1 } })
  })
})
