// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  besoinsWeekHref,
  candidatsCreatedWithinHref,
  countUnfilledThisWeek,
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
})
