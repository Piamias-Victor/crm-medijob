// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { isCronEnabled } from '@/server/cron/enabled'

describe('isCronEnabled', () => {
  it('stays off when the flag is missing', () => {
    expect(isCronEnabled({ NODE_ENV: 'production' })).toBe(false)
  })

  it('stays off for anything but an explicit true', () => {
    expect(isCronEnabled({ NODE_ENV: 'production', CRON_ENABLED: '1' })).toBe(false)
    expect(isCronEnabled({ NODE_ENV: 'production', CRON_ENABLED: 'false' })).toBe(false)
  })

  it('turns on with an explicit true', () => {
    expect(isCronEnabled({ NODE_ENV: 'production', CRON_ENABLED: ' true ' })).toBe(true)
  })
})
