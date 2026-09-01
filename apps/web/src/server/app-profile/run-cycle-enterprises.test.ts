import { describe, expect, it, vi } from 'vitest'
import { runAppProfileCycle } from './run-cycle'
import { stubCycleDeps } from './run-cycle.test-deps'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

describe('runAppProfileCycle Badakan enterprises', () => {
  it('GETs enterprises after missions on the same periodic cycle', async () => {
    const syncMissions = vi.fn().mockResolvedValue({ fetched: 1, upserted: 1 })
    const syncEnterprises = vi.fn().mockResolvedValue({ fetched: 1, upserted: 1 })
    const result = await runAppProfileCycle(
      env,
      stubCycleDeps({ syncMissions, syncEnterprises }),
    )
    expect(syncMissions).toHaveBeenCalledTimes(1)
    expect(syncEnterprises).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      missions: { fetched: 1, upserted: 1 },
      enterprises: { fetched: 1, upserted: 1 },
    })
  })
})
