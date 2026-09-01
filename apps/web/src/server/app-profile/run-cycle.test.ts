import { describe, expect, it } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { runAppProfileCycle } from './run-cycle'
import { stubCycleDeps } from './run-cycle.test-deps'

const employee = mapBadakanRecipient({
  id: 'e1',
  firstName: 'Marie',
  lastName: 'App',
})

describe('runAppProfileCycle', () => {
  it('skips when Badakan env is missing', async () => {
    await expect(runAppProfileCycle({ NODE_ENV: 'test' })).resolves.toEqual({
      skipped: true,
    })
  })

  it('pulls searchEmployees on the same periodic cycle', async () => {
    const result = await runAppProfileCycle(
      { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' },
      stubCycleDeps({
        client: { searchEmployees: async () => (employee ? [employee] : []) },
      }),
    )
    expect(result).toMatchObject({
      employees: { fetched: 1 },
      sync: { fetched: 0, upserted: 0, skippedTreated: 0 },
    })
  })
})
