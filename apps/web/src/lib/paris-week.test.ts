import { describe, expect, it } from 'vitest'
import { addDaysYmd, isPastYmd, mondayOf, parisYmd } from './paris-week'

describe('paris week', () => {
  it('resolves the ISO Monday in Europe/Paris', () => {
    const wed = new Date('2026-09-02T10:00:00.000Z')
    expect(parisYmd(wed)).toBe('2026-09-02')
    expect(mondayOf(parisYmd(wed))).toBe('2026-08-31')
  })

  it('marks dates before today in Paris as past', () => {
    const now = new Date('2026-09-02T08:00:00.000Z')
    expect(isPastYmd('2026-09-01', now)).toBe(true)
    expect(isPastYmd('2026-09-02', now)).toBe(false)
    expect(addDaysYmd('2026-08-31', 7)).toBe('2026-09-07')
  })
})
