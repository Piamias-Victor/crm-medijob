import { describe, expect, it, vi } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { runAppProfileCycle, type AppProfileCycleDeps } from './run-cycle'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

const created = mapBadakanRecipient({
  id: 'created-1',
  firstName: 'Leo',
  lastName: 'New',
})!

const completed = mapBadakanRecipient({
  id: 'e1',
  firstName: 'Marie',
  lastName: 'App',
})!

function cycleDeps(overrides: Partial<AppProfileCycleDeps> = {}): AppProfileCycleDeps {
  return {
    client: {
      searchNewEmployees: async () => [],
      searchEmployees: async () => (completed ? [completed] : []),
      searchMissions: async () => [],
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
    smsDue: async () => ({ sent: 0, skippedNoPhone: 0, failed: 0 }),
    ...overrides,
  }
}

describe('runAppProfileCycle App-validated', () => {
  it('keeps CREATED in Profils app without creating Candidate', async () => {
    const upsertPending = vi.fn()
    const syncValidated = vi.fn().mockResolvedValue({ created: 0, linked: 0, skipped: 0 })
    await runAppProfileCycle(env, cycleDeps({
      client: {
        searchNewEmployees: async () => [created],
        searchEmployees: async () => [],
        searchMissions: async () => [],
        getRecipient: async () => null,
        getComments: async () => [],
        getEnterprise: async () => null,
      },
      upsertPending,
      syncValidated,
    }))
    expect(upsertPending).toHaveBeenCalledTimes(1)
    expect(syncValidated).toHaveBeenCalledWith([])
  })

  it('syncs App-validated before Hireflix inviteDue', async () => {
    const order: string[] = []
    const syncValidated = vi.fn(async () => {
      order.push('validated')
      return { created: 1, linked: 0, skipped: 0 }
    })
    const inviteDue = vi.fn(async () => {
      order.push('invite')
      return { sent: 0, skippedNoEmail: 0, cancelled: 1, failed: 0 }
    })
    const result = await runAppProfileCycle(env, cycleDeps({ syncValidated, inviteDue }))
    expect(syncValidated).toHaveBeenCalledWith([completed])
    expect(order).toEqual(['validated', 'invite'])
    expect(result).toMatchObject({
      employees: { fetched: 1, created: 1, linked: 0, skipped: 0 },
    })
  })
})
