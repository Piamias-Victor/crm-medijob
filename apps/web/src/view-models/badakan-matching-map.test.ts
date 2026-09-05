// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { toMatchingMissionFromBadakan } from './badakan-matching-map'

describe('toMatchingMissionFromBadakan', () => {
  it('maps a resolved Badakan mission into the CRM matching input', () => {
    expect(
      toMatchingMissionFromBadakan({
        jobTitleId: 'jt-prep',
        jobTitleName: 'Préparateur',
        pharmacyName: 'Pharmacie du Cygne',
        city: 'Strasbourg',
        postalCode: '67000',
        softwareName: 'LGPI',
        activityLabel: 'Préparateur Expert',
        periods: [{ start: '2026-09-10T08:00:00.000Z', end: '2026-09-12T18:00:00.000Z' }],
      }),
    ).toEqual({
      jobTitleId: 'jt-prep',
      contractType: 'INTERIM',
      startDate: new Date('2026-09-10T08:00:00.000Z'),
      pharmacyCity: 'Strasbourg',
      pharmacyPostalCode: '67000',
      title: 'Préparateur Expert — Pharmacie du Cygne',
      jobTitleName: 'Préparateur',
      pharmacyName: 'Pharmacie du Cygne',
      description: 'LGO : LGPI',
    })
  })

  it('returns null when the métier is unresolved or no period starts', () => {
    expect(
      toMatchingMissionFromBadakan({
        jobTitleId: null,
        jobTitleName: null,
        pharmacyName: 'Hermes',
        city: 'Lyon',
        postalCode: '69001',
        softwareName: null,
        activityLabel: 'Préparateur',
        periods: [{ start: '2026-09-10', end: null }],
      }),
    ).toBeNull()
    expect(
      toMatchingMissionFromBadakan({
        jobTitleId: 'jt-prep',
        jobTitleName: 'Préparateur',
        pharmacyName: 'Hermes',
        city: null,
        postalCode: null,
        softwareName: null,
        activityLabel: null,
        periods: [],
      }),
    ).toBeNull()
  })
})
