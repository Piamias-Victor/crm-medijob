import { describe, expect, it } from 'vitest'
import {
  RETENTION_MONTHS,
  isDueForRetentionReview,
} from '@/server/gdpr/retention-policy'

describe('retention policy', () => {
  it('flags inactive candidates after 24 months', () => {
    const now = new Date('2026-08-03T00:00:00.000Z')
    const stale = new Date('2024-08-01T00:00:00.000Z')
    expect(isDueForRetentionReview('CANDIDATE_INACTIVE', stale, now)).toBe(true)
    expect(RETENTION_MONTHS.CANDIDATE_INACTIVE).toBe(24)
  })

  it('keeps recent refused applications under review threshold', () => {
    const now = new Date('2026-08-03T00:00:00.000Z')
    const recent = new Date('2026-01-01T00:00:00.000Z')
    expect(isDueForRetentionReview('APPLICATION_REFUSED', recent, now)).toBe(false)
    expect(RETENTION_MONTHS.APPLICATION_REFUSED).toBe(12)
  })
})
