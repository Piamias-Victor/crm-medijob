import { describe, expect, it } from 'vitest'
import { filterAppIntakeRows } from './filter-app-intake-rows'
import { buildAppIntakeFilterConfig } from '@/lib/filters/app-intake-filter-config'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import type { AppProfileListItem } from './app-profile-list'

function row(overrides: Partial<AppProfileListItem> = {}): AppProfileListItem {
  return {
    id: 'p1',
    badakanId: 'b1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@ex.com',
    phone: '0600000000',
    address: null,
    city: 'Paris',
    postalCode: '75001',
    activityLabel: null,
    jobTitleId: null,
    jobTitleName: 'Préparateur',
    hasResume: false,
    status: 'EN_ATTENTE',
    intakeStatus: 'A_APPELER',
    callOutcome: 'MESSAGERIE',
    plannedRdvAt: null,
    notes: 'rappeler',
    referentId: 'u1',
    referentName: 'Alice',
    relanceAt: new Date('2026-01-01'),
    isRelanceOverdue: true,
    lastCalledAt: null,
    lastCalledByName: null,
    invitationLabel: '',
    intakeBookingSmsLabel: 'Envoyé',
    badakanCommentsLabel: 'lgpi winpharma',
    syncedAt: new Date(),
    createdAt: new Date('2026-09-01'),
    ...overrides,
  }
}

describe('filterAppIntakeRows', () => {
  const config = buildAppIntakeFilterConfig([{ id: 'u1', name: 'Alice' }])
  const empty = buildDefaultFilterValues(config)

  it('filters by search across comments and notes', () => {
    const rows = [row(), row({ id: '2', firstName: 'Bob', badakanCommentsLabel: 'x' })]
    expect(
      filterAppIntakeRows(rows, { ...empty, q: 'lgpi' }).map((r) => r.id),
    ).toEqual(['p1'])
  })

  it('filters by city, sms, overdue and referent', () => {
    const rows = [
      row(),
      row({
        id: '2',
        city: 'Lyon',
        intakeBookingSmsLabel: '—',
        isRelanceOverdue: false,
        referentId: null,
      }),
    ]
    expect(
      filterAppIntakeRows(rows, {
        ...empty,
        city: 'par',
        smsSent: 'sent',
        overdue: true,
        referent: ['u1'],
      }).map((r) => r.id),
    ).toEqual(['p1'])
  })
})
