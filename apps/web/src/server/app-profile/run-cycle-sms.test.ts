import { describe, expect, it } from 'vitest'
import { runAppProfileCycle } from './run-cycle'
import { stubCycleDeps } from './run-cycle.test-deps'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

describe('runAppProfileCycle weekly availability SMS', () => {
  it('does not send SMS in the Badakan cycle so a dump timeout cannot starve texts', async () => {
    const result = await runAppProfileCycle(env, stubCycleDeps())
    expect(result).not.toHaveProperty('sms')
  })
})
