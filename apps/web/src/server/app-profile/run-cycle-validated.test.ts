import { describe, expect, it, vi } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { runAppProfileCycle } from './run-cycle'
import { stubCycleDeps } from './run-cycle.test-deps'

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

describe('runAppProfileCycle App-validated', () => {
  it('keeps CREATED in Profils app without creating Candidate', async () => {
    const upsertPending = vi.fn()
    const syncValidated = vi.fn().mockResolvedValue({ created: 0, linked: 0, skipped: 0 })
    await runAppProfileCycle(
      env,
      stubCycleDeps({
        client: {
          searchNewEmployees: async () => [created],
          searchEmployees: async () => [],
        },
        upsertPending,
        syncValidated,
      }),
    )
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
    const result = await runAppProfileCycle(
      env,
      stubCycleDeps({
        client: { searchEmployees: async () => (completed ? [completed] : []) },
        syncValidated,
        inviteDue,
      }),
    )
    expect(syncValidated).toHaveBeenCalledWith([completed])
    expect(order).toEqual(['validated', 'invite'])
    expect(result).toMatchObject({
      employees: { fetched: 1, created: 1, linked: 0, skipped: 0 },
    })
  })
})
