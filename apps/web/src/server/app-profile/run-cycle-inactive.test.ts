import { describe, expect, it, vi } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { runAppProfileCycle } from './run-cycle'
import { stubCycleDeps } from './run-cycle.test-deps'

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

describe('runAppProfileCycle SUSPENDED', () => {
  it('feeds probed SUSPENDED recipients into syncValidated', async () => {
    const syncValidated = vi.fn().mockResolvedValue({
      created: 0,
      linked: 0,
      skipped: 1,
    })
    await runAppProfileCycle(
      env,
      stubCycleDeps({
        client: { searchEmployees: async () => (completed ? [completed] : []) },
        probeInactive: async () => [suspended!],
        syncValidated,
      }),
    )
    expect(syncValidated).toHaveBeenCalledWith([completed, suspended])
  })
})
