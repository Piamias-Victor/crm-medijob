import { describe, expect, it, vi } from 'vitest'
import { runAppProfileCycle } from './run-cycle'
import { stubCycleDeps } from './run-cycle.test-deps'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

describe('runAppProfileCycle pharmacy apply email', () => {
  it('mails the pharmacy after missions/search when a recipient SEARCH_APPLIED', async () => {
    const order: string[] = []
    const syncMissions = vi.fn().mockImplementation(async () => {
      order.push('missions')
      return { fetched: 1, upserted: 1 }
    })
    const sendApplyEmails = vi.fn().mockImplementation(async () => {
      order.push('mail')
      return { sent: 1, skippedNoEmail: 0, failed: 0 }
    })
    const result = await runAppProfileCycle(
      env,
      stubCycleDeps({ syncMissions, sendApplyEmails }),
    )
    expect(order).toEqual(['missions', 'mail'])
    expect(result).toMatchObject({
      missions: { fetched: 1, upserted: 1 },
      pharmacyApplyEmail: { sent: 1, skippedNoEmail: 0, failed: 0 },
    })
  })
})
