// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  monthLabel,
  monthHref,
  dayNumber,
  dayRowLabel,
  weekSectionLabel,
} from '@/view-models/weekly-availability-month-label'

describe('month labels', () => {
  it('writes the month in French with a capital', () => {
    expect(monthLabel('2026-09')).toBe('Septembre 2026')
    expect(monthLabel('2027-01')).toBe('Janvier 2027')
  })

  it('links a month on the public availability page', () => {
    expect(monthHref('tok', '2026-10')).toBe('/dispo/tok?month=2026-10')
  })

  it('reads the day number of an ISO date', () => {
    expect(dayNumber('2026-09-07')).toBe('7')
  })

  it('names a day row with its weekday', () => {
    expect(dayRowLabel('2026-09-07')).toBe('Lundi 7')
    expect(dayRowLabel('2026-09-13')).toBe('Dimanche 13')
  })

  it('names a week section by its first and last visible day', () => {
    expect(weekSectionLabel(['2026-09-07', '2026-09-13'])).toBe('Semaine du 7 au 13')
    expect(weekSectionLabel(['2026-09-30'])).toBe('Semaine du 30')
  })
})
