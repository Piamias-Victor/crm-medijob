import { describe, expect, it } from 'vitest'
import { parisDayStartFromYmd } from '@/lib/paris-day-bounds'
import { resolveActivitePeriod } from './activite-period'

describe('resolveActivitePeriod', () => {
  it('defaults to last 30 civil days ending today Paris', () => {
    const now = new Date('2026-03-30T15:00:00.000Z')
    const period = resolveActivitePeriod({}, now)
    expect(period.fromYmd).toBe('2026-03-01')
    expect(period.toYmd).toBe('2026-03-30')
  })

  it('falls back when from > to', () => {
    const now = new Date('2026-03-30T15:00:00.000Z')
    const period = resolveActivitePeriod({ from: '2026-04-01', to: '2026-03-01' }, now)
    expect(period.fromYmd).toBe('2026-03-01')
    expect(period.toYmd).toBe('2026-03-30')
  })

  it('falls back on invalid dates', () => {
    const now = new Date('2026-03-30T15:00:00.000Z')
    const period = resolveActivitePeriod({ from: 'nope', to: '2026-03-10' }, now)
    expect(period.fromYmd).toBe('2026-03-01')
  })

  it('uses inclusive Paris day bounds as [start, nextMidnight)', () => {
    const period = resolveActivitePeriod({ from: '2026-03-28', to: '2026-03-29' })
    expect(period.fromInclusive).toEqual(parisDayStartFromYmd('2026-03-28'))
    expect(period.toExclusive).toEqual(parisDayStartFromYmd('2026-03-30'))
  })
})

describe('parisDayStartFromYmd DST', () => {
  it('handles spring forward 2026-03-29 Paris midnight', () => {
    const start = parisDayStartFromYmd('2026-03-29')
    expect(start.toISOString()).toBe('2026-03-28T23:00:00.000Z')
  })

  it('handles autumn winter 2026-10-25 Paris midnight', () => {
    const start = parisDayStartFromYmd('2026-10-25')
    expect(start.toISOString()).toBe('2026-10-24T22:00:00.000Z')
  })
})
