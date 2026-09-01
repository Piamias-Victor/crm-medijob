import { describe, expect, it } from 'vitest'
import { mapBadakanMission } from './map-mission'

const hermesRaw = {
  id: 'm-hermes',
  currentStep: 'CANCELLED',
  expectedStartDate: '2026-08-01',
  expectedEndDate: '2026-08-03',
  enterprise: { id: 'ent-hermes', enterpriseName: 'Pharmacie Hermes' },
  recipients: [
    {
      id: 'r-lucie',
      firstName: 'Lucie',
      lastName: 'Robert',
      validatedPhoneNumber: '0601020304',
      currentStep: 'SEARCH_APPLIED',
    },
    {
      id: 'r-margo',
      firstName: 'Margo',
      lastName: 'Rie',
      currentStep: 'MISSION_VALIDATED',
    },
  ],
}

describe('mapBadakanMission', () => {
  it('maps pharmacy, periods, step and SEARCH_APPLIED phone only', () => {
    const mapped = mapBadakanMission(hermesRaw)
    expect(mapped).toMatchObject({
      badakanId: 'm-hermes',
      pharmacyName: 'Pharmacie Hermes',
      enterpriseId: 'ent-hermes',
      step: 'CANCELLED',
      periods: [{ start: '2026-08-01', end: '2026-08-03' }],
      searchApplied: [
        {
          recipientId: 'r-lucie',
          firstName: 'Lucie',
          lastName: 'Robert',
          phone: '0601020304',
        },
      ],
    })
  })

  it('returns null without an id', () => {
    expect(mapBadakanMission({ currentStep: 'CREATED' })).toBeNull()
  })
})
