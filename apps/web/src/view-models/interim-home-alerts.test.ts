// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  besoinsWeekHref,
  candidatsCreatedWithinHref,
  countUnfilledThisWeek,
  listUnfilledThisWeek,
  toHomeAlertCandidates,
} from '@/view-models/interim-home-alerts'
import type { BadakanNeedListItem } from '@/view-models/badakan-need-list'

const base: BadakanNeedListItem = {
  id: 'n1',
  pharmacyName: 'Pharma',
  cityLabel: 'Lyon',
  postalCode: '69001',
  jobTitleLabel: 'Pharmacien',
  softwareLabel: 'LGPI',
  gapLabel: '0/1 pourvus',
  periodLabel: 'x',
  periods: [{ start: '2026-09-08', end: '2026-09-10' }],
  expectedRecipients: 1,
  staffedRecipients: 0,
  step: 'CREATED',
  stepLabel: 'Créée',
  href: '/interim/missions/n1',
}

describe('interim home alerts', () => {
  it('builds besoins week and candidats createdWithin hrefs', () => {
    expect(besoinsWeekHref()).toBe('/interim/besoins?week=current')
    expect(candidatsCreatedWithinHref(24)).toBe('/interim/candidats?createdWithinHours=24')
  })

  it('counts open needs overlapping the current week', () => {
    const now = new Date('2026-09-09T12:00:00Z')
    expect(countUnfilledThisWeek([base], now)).toBe(1)
    expect(
      countUnfilledThisWeek([{ ...base, staffedRecipients: 1 }], now),
    ).toBe(0)
  })

  it('lists unfilled needs this week with pharmacy job period href', () => {
    const now = new Date('2026-09-09T12:00:00Z')
    const other: BadakanNeedListItem = {
      ...base,
      id: 'n2',
      periods: [{ start: '2026-10-01', end: '2026-10-02' }],
    }
    expect(listUnfilledThisWeek([base, other], now)).toEqual([
      {
        id: 'n1',
        pharmacyName: 'Pharma',
        jobTitleLabel: 'Pharmacien',
        periodLabel: 'x',
        href: '/interim/missions/n1',
      },
    ])
  })

  it('excludes cancelled missions from unfilled this week', () => {
    const now = new Date('2026-09-09T12:00:00Z')
    const cancelled: BadakanNeedListItem = {
      ...base,
      id: 'n-cancel',
      step: 'CANCELLED',
      stepLabel: 'Annulée',
    }
    expect(listUnfilledThisWeek([base, cancelled], now).map((row) => row.id)).toEqual(['n1'])
  })

  it('maps recent candidates to home alert rows', () => {
    expect(
      toHomeAlertCandidates([
        { id: 'c1', firstName: 'Ada', lastName: 'Lovelace', jobTitle: { name: 'Pharmacien' } },
      ]),
    ).toEqual([
      {
        id: 'c1',
        name: 'Ada Lovelace',
        jobTitle: 'Pharmacien',
        href: '/candidats/c1',
      },
    ])
  })
})
