// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  toMonthGrid,
  selectedMonthSlots,
  visibleMonthWeeks,
  countSelectedHalfDays,
} from '@/view-models/weekly-availability-month-grid'

const now = new Date('2026-09-03T09:00:00.000Z')

describe('toMonthGrid', () => {
  it('lays september 2026 out as monday-aligned weeks', () => {
    const grid = toMonthGrid({ month: '2026-09', slots: [], now })
    expect(grid.weeks).toHaveLength(5)
    expect(grid.weeks[0]!.weekStart).toBe('2026-08-31')
    expect(grid.weeks[0]!.days).toHaveLength(7)
    expect(grid.weeks.at(-1)!.days.at(-1)!.date).toBe('2026-10-04')
  })

  it('locks days outside the month and days already past', () => {
    const grid = toMonthGrid({ month: '2026-09', slots: [], now })
    const [aug31, sep1, , , sep4] = grid.weeks[0]!.days
    expect(aug31).toMatchObject({ date: '2026-08-31', inMonth: false, clickable: false })
    expect(sep1).toMatchObject({ date: '2026-09-01', inMonth: true, clickable: false })
    expect(sep4).toMatchObject({ date: '2026-09-04', inMonth: true, clickable: true })
  })

  it('marks the declared slots as selected', () => {
    const grid = toMonthGrid({
      month: '2026-09',
      slots: [{ date: '2026-09-15', period: 'AM' }],
      now,
    })
    const sep15 = grid.weeks.flatMap((w) => w.days).find((d) => d.date === '2026-09-15')
    expect(sep15).toMatchObject({ am: true, pm: false })
  })
})

describe('visibleMonthWeeks', () => {
  it('keeps only the days of the month, so no filler cell reaches the UI', () => {
    const weeks = visibleMonthWeeks(toMonthGrid({ month: '2026-09', slots: [], now }))
    expect(weeks[0]!.days.map((day) => day.date)).toEqual([
      '2026-09-01',
      '2026-09-02',
      '2026-09-03',
      '2026-09-04',
      '2026-09-05',
      '2026-09-06',
    ])
    expect(weeks.at(-1)!.days.map((day) => day.date)).toEqual(['2026-09-28', '2026-09-29', '2026-09-30'])
    expect(weeks.every((week) => week.days.length > 0)).toBe(true)
  })
})

describe('countSelectedHalfDays', () => {
  it('counts every checked AM or PM cell', () => {
    const grid = toMonthGrid({
      month: '2026-09',
      slots: [
        { date: '2026-09-15', period: 'AM' },
        { date: '2026-09-15', period: 'PM' },
        { date: '2026-09-22', period: 'PM' },
      ],
      now,
    })
    expect(countSelectedHalfDays(grid)).toBe(3)
  })
})

describe('selectedMonthSlots', () => {
  it('returns the selected slots of the month in date order', () => {
    const grid = toMonthGrid({
      month: '2026-09',
      slots: [
        { date: '2026-09-15', period: 'AM' },
        { date: '2026-09-15', period: 'PM' },
        { date: '2026-09-22', period: 'PM' },
      ],
      now,
    })
    expect(selectedMonthSlots(grid)).toEqual([
      { date: '2026-09-15', period: 'AM' },
      { date: '2026-09-15', period: 'PM' },
      { date: '2026-09-22', period: 'PM' },
    ])
  })
})
