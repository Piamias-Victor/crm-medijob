import { describe, expect, it } from 'vitest'
import { needStartsInFuture } from './interim-need-sms-start'

const now = new Date('2026-10-27T10:45:00.000Z')

describe('needStartsInFuture', () => {
  it('is true when start is after now', () => {
    expect(needStartsInFuture(new Date('2026-10-27T11:00:00.000Z'), now)).toBe(true)
  })

  it('is false when start is before now', () => {
    expect(needStartsInFuture(new Date('2026-10-27T09:00:00.000Z'), now)).toBe(false)
  })

  it('is false when start equals now', () => {
    expect(needStartsInFuture(now, now)).toBe(false)
  })

  it('is false when start is missing', () => {
    expect(needStartsInFuture(null, now)).toBe(false)
  })
})
