import { describe, expect, it } from 'vitest'
import { runAppProfileCycle } from './run-cycle'

describe('runAppProfileCycle', () => {
  it('skips when Badakan env is missing', async () => {
    await expect(runAppProfileCycle({ NODE_ENV: 'test' })).resolves.toEqual({
      skipped: true,
    })
  })
})
