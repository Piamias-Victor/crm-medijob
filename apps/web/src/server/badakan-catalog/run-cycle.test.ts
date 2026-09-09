import { describe, expect, it, vi } from 'vitest'
import { runBadakanCatalogCycle } from './run-cycle'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

describe('runBadakanCatalogCycle', () => {
  it('skips when Badakan env is missing', async () => {
    await expect(runBadakanCatalogCycle({ NODE_ENV: 'test' })).resolves.toEqual({
      skipped: true,
    })
  })

  it('syncs enterprises, auto-creates ready pharmacies, then contracts, then sign-invite SMS', async () => {
    const order: string[] = []
    const syncEnterprises = vi.fn().mockImplementation(async () => {
      order.push('enterprises')
      return { fetched: 162, upserted: 94 }
    })
    const syncContracts = vi.fn().mockImplementation(async () => {
      order.push('contracts')
      return { fetched: 1, upserted: 1 }
    })
    const sendSignInviteSms = vi.fn().mockImplementation(async () => {
      order.push('sms')
      return { sent: 1, skippedNoPhone: 0, failed: 0 }
    })
    const result = await runBadakanCatalogCycle(env, {
      syncEnterprises,
      promoteReady: async () => {
        order.push('pharmacies')
        return { created: 80, skipped: 14 }
      },
      syncContracts,
      sendSignInviteSms,
    })
    expect(order).toEqual(['enterprises', 'pharmacies', 'contracts', 'sms'])
    expect(result).toEqual({
      enterprises: { fetched: 162, upserted: 94 },
      pharmacies: { created: 80, skipped: 14 },
      contracts: { fetched: 1, upserted: 1 },
      sms: { sent: 1, skippedNoPhone: 0, failed: 0 },
    })
  })
})
