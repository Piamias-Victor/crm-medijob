import { describe, expect, it } from 'vitest'
import { firstPeriodStartAt } from './badakan-mission-periods'

describe('firstPeriodStartAt', () => {
  it('returns the first parseable period start', () => {
    expect(
      firstPeriodStartAt([
        { start: null, end: null },
        { start: '2026-10-27T08:00:00.000Z', end: null },
      ]),
    ).toEqual(new Date('2026-10-27T08:00:00.000Z'))
  })

  it('returns null when no start exists', () => {
    expect(firstPeriodStartAt([{ start: null, end: '2026-10-27' }])).toBeNull()
  })
})
