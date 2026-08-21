import { describe, expect, it } from 'vitest'
import { isCronAuthorized } from './run-ingest'

describe('isCronAuthorized', () => {
  it('accepts the bearer secret', () => {
    expect(isCronAuthorized('Bearer cron-secret', 'cron-secret')).toBe(true)
  })

  it('rejects missing or wrong secrets', () => {
    expect(isCronAuthorized('Bearer cron-secret', '')).toBe(false)
    expect(isCronAuthorized('Bearer other', 'cron-secret')).toBe(false)
    expect(isCronAuthorized(null, 'cron-secret')).toBe(false)
  })
})
