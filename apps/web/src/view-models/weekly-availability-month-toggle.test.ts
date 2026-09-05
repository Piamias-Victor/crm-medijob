// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { toMonthGrid, type MonthGrid } from '@/view-models/weekly-availability-month-grid'
import { toggleMonthSelection } from '@/view-models/weekly-availability-month-toggle'

const now = new Date('2026-09-03T09:00:00.000Z')
const grid = toMonthGrid({ month: '2026-09', slots: [], now })
const dayOf = (g: MonthGrid, date: string) =>
  g.weeks.flatMap((week) => week.days).find((day) => day.date === date)!

describe('toggleMonthSelection', () => {
  it('toggles a single AM cell', () => {
    const next = toggleMonthSelection(grid, { kind: 'cell', date: '2026-09-15', period: 'AM' })
    expect(dayOf(next, '2026-09-15')).toMatchObject({ am: true, pm: false })
  })

  it('selects both periods of a day, then clears them on second click', () => {
    const on = toggleMonthSelection(grid, { kind: 'day', date: '2026-09-15' })
    expect(dayOf(on, '2026-09-15')).toMatchObject({ am: true, pm: true })
    const off = toggleMonthSelection(on, { kind: 'day', date: '2026-09-15' })
    expect(dayOf(off, '2026-09-15')).toMatchObject({ am: false, pm: false })
  })

  it('selects a whole week in one click', () => {
    const next = toggleMonthSelection(grid, { kind: 'week', weekStart: '2026-09-14' })
    expect(dayOf(next, '2026-09-14')).toMatchObject({ am: true, pm: true })
    expect(dayOf(next, '2026-09-20')).toMatchObject({ am: true, pm: true })
    expect(dayOf(next, '2026-09-21')).toMatchObject({ am: false, pm: false })
  })

  it('selects every morning of the month in one click', () => {
    const next = toggleMonthSelection(grid, { kind: 'period', period: 'AM' })
    expect(dayOf(next, '2026-09-15')).toMatchObject({ am: true, pm: false })
    expect(dayOf(next, '2026-09-30')).toMatchObject({ am: true, pm: false })
  })

  it('selects the whole month in one click', () => {
    const next = toggleMonthSelection(grid, { kind: 'month' })
    expect(dayOf(next, '2026-09-15')).toMatchObject({ am: true, pm: true })
    expect(dayOf(next, '2026-09-30')).toMatchObject({ am: true, pm: true })
  })

  it('never selects a locked day', () => {
    const next = toggleMonthSelection(grid, { kind: 'period', period: 'AM' })
    expect(dayOf(next, '2026-09-01')).toMatchObject({ am: false })
    expect(dayOf(next, '2026-08-31')).toMatchObject({ am: false })
  })
})
