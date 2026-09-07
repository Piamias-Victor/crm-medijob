import { describe, expect, it } from 'vitest'
import { getIdleTimeoutMs } from './constants'

const DAY_MS = 24 * 60 * 60_000

describe('getIdleTimeoutMs', () => {
  it('defaults to 24 hours when AUTH_IDLE_MS is unset', () => {
    expect(getIdleTimeoutMs({})).toBe(DAY_MS)
  })

  it('uses AUTH_IDLE_MS when it is a positive integer', () => {
    expect(getIdleTimeoutMs({ AUTH_IDLE_MS: '120000' })).toBe(120_000)
  })
})
