import { describe, expect, it } from 'vitest'
import { toWeekGrid } from '@/view-models/weekly-availability-grid'

describe('toWeekGrid', () => {
  it('shows one week and disables past days in Europe/Paris', () => {
    const grid = toWeekGrid({
      weekStart: '2026-08-31',
      slots: [{ date: '2026-09-02', period: 'AM' }],
      now: new Date('2026-09-02T08:00:00.000Z'),
    })
    expect(grid.days).toHaveLength(7)
    expect(grid.days[0]).toMatchObject({ date: '2026-08-31', clickable: false })
    expect(grid.days[1]).toMatchObject({ date: '2026-09-01', clickable: false })
    expect(grid.days[2]).toMatchObject({
      date: '2026-09-02',
      clickable: true,
      am: true,
      pm: false,
    })
    expect(grid.days[6]).toMatchObject({ date: '2026-09-06', clickable: true })
  })
})
