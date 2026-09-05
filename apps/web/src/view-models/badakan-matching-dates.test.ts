// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { missionDateRange } from './badakan-matching-dates'

describe('missionDateRange', () => {
  it('covers every day from the earliest start to the latest end', () => {
    expect(
      missionDateRange([
        { start: '2026-09-10T08:00:00.000Z', end: '2026-09-10T18:00:00.000Z' },
        { start: '2026-09-12T08:00:00.000Z', end: '2026-09-12T18:00:00.000Z' },
      ]),
    ).toEqual({ from: '2026-09-10', to: '2026-09-12' })
  })

  it('returns null without usable dates', () => {
    expect(missionDateRange([])).toBeNull()
    expect(missionDateRange([{ start: null, end: null }])).toBeNull()
  })
})
