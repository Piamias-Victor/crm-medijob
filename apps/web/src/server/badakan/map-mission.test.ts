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

  it('accepts the epoch milliseconds Badakan actually returns for dates', () => {
    const mapped = mapBadakanMission({
      id: 'm-epoch',
      currentStep: 'CREATED',
      expectedStartDate: 1786924800000,
      expectedEndDate: 1787097600000,
      periods: [{ startDate: 1786924800000, endDate: 1787097600000 }],
    })
    expect(mapped?.periods).toEqual([
      { start: '2026-08-17T00:00:00.000Z', end: '2026-08-19T00:00:00.000Z' },
    ])
  })

  it('reads applicants keyed by recipientId, as missions actually return them', () => {
    const mapped = mapBadakanMission({
      id: 'm-recipientid',
      currentStep: 'STAFFED',
      recipients: [
        {
          recipientId: 'r-margo',
          firstName: 'Margo',
          lastName: 'Rié',
          validatedPhoneNumber: '+33661320419',
          currentStep: 'SEARCH_APPLIED',
        },
      ],
    })
    expect(mapped?.searchApplied).toEqual([
      { recipientId: 'r-margo', firstName: 'Margo', lastName: 'Rié', phone: '+33661320419' },
    ])
  })

  it('keeps the mission when one applicant has no id at all', () => {
    const mapped = mapBadakanMission({
      id: 'm-partial',
      currentStep: 'STAFFED',
      recipients: [{ firstName: 'Sans', lastName: 'Id', currentStep: 'SEARCH_APPLIED' }],
    })
    expect(mapped).toMatchObject({ badakanId: 'm-partial', searchApplied: [] })
  })

  it('returns null without an id', () => {
    expect(mapBadakanMission({ currentStep: 'CREATED' })).toBeNull()
  })

  it('reads the job activity, the officine address and the staffing gap', () => {
    const mapped = mapBadakanMission({
      id: 'm-full',
      identifier: '1029',
      currentStep: 'CREATED',
      activity: { label: 'Préparateur Débutant', id: 'act-prep-deb' },
      grade: { level: '310', hourlyRate: 16 },
      hourlyRateWithoutTaxes: 16,
      instruction: 'LGPI',
      expectedNumberOfRecipients: 2,
      staffedNumberOfRecipients: 1,
      reason: 'Accroissement temporaire d’activité',
      contact: { firstName: 'Dominique', lastName: 'Litzler', phone: '+33660589104' },
      enterprise: {
        id: 'ent-cygne',
        enterpriseName: 'Pharmacie du Cygne',
        address: {
          address1: '24 Rue du 22 Novembre',
          zipCode: '67000',
          city: 'Strasbourg',
          location: { type: 'Point', coordinates: [7.7431761, 48.5826493] },
        },
      },
    })
    expect(mapped).toMatchObject({
      identifier: '1029',
      activityId: 'act-prep-deb',
      activityLabel: 'Préparateur Débutant',
      address: '24 Rue du 22 Novembre',
      city: 'Strasbourg',
      postalCode: '67000',
      latitude: 48.5826493,
      longitude: 7.7431761,
      softwareLabel: 'LGPI',
      contactName: 'Dominique Litzler',
      contactPhone: '+33660589104',
      hourlyRate: 16,
      reasonLabel: 'Accroissement temporaire d’activité',
      expectedRecipients: 2,
      staffedRecipients: 1,
    })
  })

  it('leaves the new fields empty when Badakan omits them', () => {
    const mapped = mapBadakanMission({ id: 'm-bare', currentStep: 'CREATED' })
    expect(mapped).toMatchObject({
      activityId: null,
      activityLabel: null,
      city: null,
      latitude: null,
      softwareLabel: null,
      contactName: null,
      hourlyRate: null,
      expectedRecipients: 0,
      staffedRecipients: 0,
    })
  })
})
