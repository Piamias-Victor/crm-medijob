import { describe, expect, it } from 'vitest'
import { canCopyWeeklyAvailabilityLink, slotsFromDays } from './weekly-availability-slots'
import { weeklyAvailabilityPath, weeklyAvailabilityUrl } from './weekly-availability-path'

describe('weekly availability view-models', () => {
  it('builds a public path and copyable URL', () => {
    expect(weeklyAvailabilityPath('tok')).toBe('/dispo/tok')
    expect(weeklyAvailabilityUrl('http://localhost:3000/', 'tok')).toBe(
      'http://localhost:3000/dispo/tok',
    )
  })

  it('exposes the copy action only for origin App', () => {
    expect(canCopyWeeklyAvailabilityLink('APP')).toBe(true)
    expect(canCopyWeeklyAvailabilityLink('CRM')).toBe(false)
  })

  it('collects checked AM/PM cells as slots', () => {
    expect(
      slotsFromDays([
        { date: '2026-09-02', clickable: true, am: true, pm: false },
        { date: '2026-09-03', clickable: true, am: false, pm: true },
      ]),
    ).toEqual([
      { date: '2026-09-02', period: 'AM' },
      { date: '2026-09-03', period: 'PM' },
    ])
  })
})
