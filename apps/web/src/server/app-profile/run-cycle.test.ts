import { describe, expect, it } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { runAppProfileCycle, type AppProfileCycleDeps } from './run-cycle'

const employee = mapBadakanRecipient({
  id: 'e1',
  firstName: 'Marie',
  lastName: 'App',
})

const stubDeps: AppProfileCycleDeps = {
  client: {
    searchNewEmployees: async () => [],
    searchEmployees: async () => (employee ? [employee] : []),
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
}

describe('runAppProfileCycle', () => {
  it('skips when Badakan env is missing', async () => {
    await expect(runAppProfileCycle({ NODE_ENV: 'test' })).resolves.toEqual({
      skipped: true,
    })
  })

  it('pulls searchEmployees on the same periodic cycle', async () => {
    const result = await runAppProfileCycle(
      { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' },
      stubDeps,
    )
    expect(result).toMatchObject({
      employees: { fetched: 1 },
      sync: { fetched: 0, upserted: 0, skippedTreated: 0 },
    })
  })
})
