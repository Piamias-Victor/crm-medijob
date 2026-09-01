import { describe, expect, it, vi } from 'vitest'
import { runAppProfileCycle } from './run-cycle'
import { stubCycleDeps } from './run-cycle.test-deps'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

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
    const result = await runAppProfileCycle(env, stubCycleDeps({ syncValidated, smsDue }))
    expect(order).toEqual(['validated', 'sms'])
    expect(result).toMatchObject({ sms: { sent: 1 } })
  })
})
