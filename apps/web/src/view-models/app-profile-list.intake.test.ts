import { describe, expect, it } from 'vitest'
import { toAppProfileListItem } from './app-profile-list'

const base = {
  id: 'p1',
  badakanId: 'bk1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: null,
  phone: null,
  address: null,
  city: null,
  postalCode: null,
  activityLabel: null,
  jobTitleId: null,
  hasResume: false,
  status: 'EN_ATTENTE' as const,
  syncedAt: new Date('2026-03-12T10:00:00.000Z'),
  createdAt: new Date('2026-03-10T08:00:00.000Z'),
  jobTitle: null,
}

describe('toAppProfileListItem intake fields', () => {
  it('defaults missing Intake status to A_APPELER', () => {
    expect(toAppProfileListItem(base).intakeStatus).toBe('A_APPELER')
    expect(toAppProfileListItem(base).callOutcome).toBeNull()
    expect(toAppProfileListItem(base).plannedRdvAt).toBeNull()
    expect(toAppProfileListItem(base).notes).toBeNull()
  })

  it('maps Intake ops fields when present', () => {
    const plannedRdvAt = new Date('2026-04-01T10:00:00.000Z')
    expect(
      toAppProfileListItem({
        ...base,
        intakeStatus: 'A_RELANCER',
        callOutcome: 'RDV_PRIS',
        plannedRdvAt,
        notes: 'ok',
      }),
    ).toMatchObject({
      intakeStatus: 'A_RELANCER',
      callOutcome: 'RDV_PRIS',
      plannedRdvAt,
      notes: 'ok',
    })
  })

  it('maps Intake booking SMS indicator from calendarSmsSentAt', () => {
    expect(toAppProfileListItem(base).intakeBookingSmsLabel).toBe('—')
    expect(
      toAppProfileListItem({
        ...base,
        calendarSmsSentAt: new Date('2026-09-01T00:00:00.000Z'),
      }).intakeBookingSmsLabel,
    ).toBe('Envoyé')
  })
})
