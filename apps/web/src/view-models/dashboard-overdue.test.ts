import { describe, expect, it } from 'vitest'
import { isOverdueFollowUp, overdueFollowUpCutoff } from './dashboard-overdue'

describe('isOverdueFollowUp', () => {
  const now = new Date('2026-08-01T12:00:00.000Z')
  const cutoff = overdueFollowUpCutoff(now, 7)

  it('flags open mission with no activity older than cutoff', () => {
    expect(
      isOverdueFollowUp(
        { createdAt: new Date('2026-07-20T12:00:00.000Z'), lastActivityAt: null },
        cutoff,
      ),
    ).toBe(true)
  })

  it('keeps recent mission without activity out of overdue', () => {
    expect(
      isOverdueFollowUp(
        { createdAt: new Date('2026-07-30T12:00:00.000Z'), lastActivityAt: null },
        cutoff,
      ),
    ).toBe(false)
  })

  it('uses last ActivityLog date when present', () => {
    expect(
      isOverdueFollowUp(
        {
          createdAt: new Date('2026-06-01T12:00:00.000Z'),
          lastActivityAt: new Date('2026-07-30T12:00:00.000Z'),
        },
        cutoff,
      ),
    ).toBe(false)
  })
})
