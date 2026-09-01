import { describe, expect, it, vi } from 'vitest'
import { runAppProfileCycle } from './run-cycle'
import { stubCycleDeps } from './run-cycle.test-deps'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

describe('runAppProfileCycle Badakan contracts', () => {
  it('pulls contracts/search on the same periodic cycle', async () => {
    const syncContracts = vi.fn().mockResolvedValue({ fetched: 1, upserted: 1 })
    const result = await runAppProfileCycle(env, stubCycleDeps({ syncContracts }))
    expect(syncContracts).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({ contracts: { fetched: 1, upserted: 1 } })
  })
})
