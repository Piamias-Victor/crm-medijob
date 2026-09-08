import { describe, expect, it } from 'vitest'
import { runAppProfileCycle } from './run-cycle'
import { stubCycleDeps } from './run-cycle.test-deps'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

describe('runAppProfileCycle Badakan enterprises', () => {
  it('does not GET enterprises so probe/convert cannot starve officines', async () => {
    const result = await runAppProfileCycle(env, stubCycleDeps())
    expect(result).not.toHaveProperty('enterprises')
  })
})
