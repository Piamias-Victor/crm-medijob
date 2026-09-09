import { describe, expect, it } from 'vitest'
import { mapBadakanMission } from './map-mission'

describe('mapBadakanMission fields', () => {
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
