import { describe, expect, it, vi } from 'vitest'
import { runAppProfileCycle, type AppProfileCycleDeps } from './run-cycle'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

function cycleDeps(overrides: Partial<AppProfileCycleDeps> = {}): AppProfileCycleDeps {
  return {
    client: {
      searchNewEmployees: async () => [],
      searchEmployees: async () => [],
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
    smsDue: async () => ({ sent: 0, skippedNoPhone: 0, failed: 0 }),
    ...overrides,
  }
}

describe('runAppProfileCycle weekly availability SMS', () => {
  it('sends due SMS after App-validated sync, not as a weekly cron', async () => {
    const order: string[] = []
    const syncValidated = vi.fn(async () => {
      order.push('validated')
      return { created: 1, linked: 0, skipped: 0 }
    })
    const smsDue = vi.fn(async () => {
      order.push('sms')
      return { sent: 1, skippedNoPhone: 0, failed: 0 }
    })
    const result = await runAppProfileCycle(env, cycleDeps({ syncValidated, smsDue }))
    expect(order).toEqual(['validated', 'sms'])
    expect(result).toMatchObject({ sms: { sent: 1 } })
  })
})
