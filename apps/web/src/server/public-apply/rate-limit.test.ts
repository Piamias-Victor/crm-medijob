import { describe, expect, it } from 'vitest'
import { rateLimitDecision } from '@/server/public-apply/rate-limit'

describe('rateLimitDecision', () => {
  const start = new Date('2026-10-02T10:00:00Z')

  it('allows first submit', () => {
    expect(rateLimitDecision(null, start).allowed).toBe(true)
  })

  it('blocks sixth submit in window', () => {
    const bucket = { count: 5, windowStartedAt: start }
    expect(rateLimitDecision(bucket, new Date(start.getTime() + 1000)).allowed).toBe(false)
  })

  it('resets after window', () => {
    const bucket = { count: 5, windowStartedAt: start }
    const later = new Date(start.getTime() + 60 * 60 * 1000 + 1)
    expect(rateLimitDecision(bucket, later)).toMatchObject({ allowed: true, nextCount: 1 })
  })
})
