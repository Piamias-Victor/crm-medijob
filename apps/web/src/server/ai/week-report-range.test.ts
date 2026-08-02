// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { isoWeekRangeParis } from '@/server/ai/week-report-range'

describe('isoWeekRangeParis', () => {
  it('bounds the ISO week containing a mid-week Paris instant (Mon→next Mon)', () => {
    // Wednesday 2026-08-05 14:30 in Paris (CEST, UTC+2)
    const now = new Date('2026-08-05T12:30:00.000Z')
    const { from, to } = isoWeekRangeParis(now)

    expect(from.toISOString()).toBe('2026-08-02T22:00:00.000Z') // Mon 00:00 Paris (CEST)
    expect(to.toISOString()).toBe('2026-08-09T22:00:00.000Z') // next Mon 00:00 Paris
  })

  it('keeps a Sunday inside the week that started the previous Monday', () => {
    // Sunday 2026-08-09 10:00 Paris
    const now = new Date('2026-08-09T08:00:00.000Z')
    const { from, to } = isoWeekRangeParis(now)

    expect(from.toISOString()).toBe('2026-08-02T22:00:00.000Z')
    expect(to.toISOString()).toBe('2026-08-09T22:00:00.000Z')
  })
})
