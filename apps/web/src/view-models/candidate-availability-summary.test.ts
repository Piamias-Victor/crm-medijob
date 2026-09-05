// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { toMonthGrid } from '@/view-models/weekly-availability-month-grid'
import { availabilitySummary } from '@/view-models/candidate-availability-summary'

const now = new Date('2026-09-03T09:00:00.000Z')

const grid = toMonthGrid({
  month: '2026-09',
  slots: [
    { date: '2026-09-15', period: 'AM' },
    { date: '2026-09-15', period: 'PM' },
    { date: '2026-09-16', period: 'AM' },
    { date: '2026-09-17', period: 'PM' },
  ],
  now,
})

describe('availabilitySummary', () => {
  it('splits the month into what a recruiter can staff', () => {
    expect(availabilitySummary(grid)).toEqual({
      total: 4,
      fullDays: 1,
      mornings: 2,
      afternoons: 2,
    })
  })

  it('reports an empty month', () => {
    expect(availabilitySummary(toMonthGrid({ month: '2026-09', slots: [], now }))).toEqual({
      total: 0,
      fullDays: 0,
      mornings: 0,
      afternoons: 0,
    })
  })
})
