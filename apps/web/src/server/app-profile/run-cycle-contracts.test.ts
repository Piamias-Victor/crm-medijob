import { describe, expect, it } from 'vitest'
import { runAppProfileCycle } from './run-cycle'
import { stubCycleDeps } from './run-cycle.test-deps'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

describe('runAppProfileCycle Badakan contracts', () => {
  it('does not pull contracts so officines stay on their own cron', async () => {
    const result = await runAppProfileCycle(env, stubCycleDeps())
    expect(result).not.toHaveProperty('contracts')
  })
})
