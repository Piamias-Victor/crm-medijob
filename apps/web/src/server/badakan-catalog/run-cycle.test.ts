import { describe, expect, it, vi } from 'vitest'
import { runBadakanCatalogCycle } from './run-cycle'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

describe('runBadakanCatalogCycle', () => {
  it('skips when Badakan env is missing', async () => {
    await expect(runBadakanCatalogCycle({ NODE_ENV: 'test' })).resolves.toEqual({
      skipped: true,
    })
  })

  it('syncs enterprises then contracts on the catalog cron', async () => {
    const order: string[] = []
    const syncEnterprises = vi.fn().mockImplementation(async () => {
      order.push('enterprises')
      return { fetched: 162, upserted: 94 }
    })
    const syncContracts = vi.fn().mockImplementation(async () => {
      order.push('contracts')
      return { fetched: 1, upserted: 1 }
    })
    const result = await runBadakanCatalogCycle(env, {
      syncEnterprises,
      syncContracts,
    })
    expect(order).toEqual(['enterprises', 'contracts'])
    expect(result).toEqual({
      enterprises: { fetched: 162, upserted: 94 },
      contracts: { fetched: 1, upserted: 1 },
    })
  })
})
