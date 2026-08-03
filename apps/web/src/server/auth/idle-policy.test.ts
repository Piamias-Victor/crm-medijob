import { describe, it, expect } from 'vitest'
import { evaluateIdleSession } from './idle-policy'

describe('evaluateIdleSession', () => {
  const idleMs = 30 * 60_000
  const now = new Date('2026-08-01T12:30:00.000Z')

  it('marks session expired after idle window', () => {
    const lastActivityAt = new Date('2026-08-01T12:00:00.000Z')
    expect(evaluateIdleSession({ lastActivityAt, now, idleMs })).toBe('expired')
  })

  it('keeps session ok when activity is within window', () => {
    const lastActivityAt = new Date('2026-08-01T12:10:00.000Z')
    expect(evaluateIdleSession({ lastActivityAt, now, idleMs })).toBe('ok')
  })
})
