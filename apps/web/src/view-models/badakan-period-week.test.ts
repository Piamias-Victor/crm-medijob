// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { periodOverlapsWeek } from '@/view-models/badakan-period-week'

describe('periodOverlapsWeek', () => {
  it('detects overlap with current Paris week bounds', () => {
    expect(
      periodOverlapsWeek([{ start: '2026-09-08', end: '2026-09-10' }], '2026-09-07', '2026-09-13'),
    ).toBe(true)
    expect(
      periodOverlapsWeek([{ start: '2026-09-01', end: '2026-09-02' }], '2026-09-07', '2026-09-13'),
    ).toBe(false)
  })
})
