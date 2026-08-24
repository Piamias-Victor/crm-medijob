import { describe, expect, it } from 'vitest'
import { buildInterimPharmacyAggregates } from '@/view-models/facturation-interim-pharmacy'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

function row(overrides: Partial<FacturationSuiviRow>): FacturationSuiviRow {
  return {
    missionId: null,
    financeLineId: 'l1',
    pharmacyId: 'p1',
    pharmacyName: 'Pharma Nord',
    referentId: null,
    referentName: null,
    contractType: 'INTERIM',
    commercialStatus: 'ACCEPTE',
    sentAt: null,
    acceptedAt: new Date('2026-08-01T00:00:00Z'),
    hours: 10,
    amountHt: 400,
    marge: 100,
    ...overrides,
  }
}

describe('buildInterimPharmacyAggregates', () => {
  it('groups Intérim lines by Pharmacy: missions, hours, CA, Marge', () => {
    expect(
      buildInterimPharmacyAggregates([
        row({ hours: 10, amountHt: 400, marge: 100 }),
        row({ financeLineId: 'l2', hours: 5, amountHt: 200, marge: 40 }),
      ]),
    ).toEqual([
      expect.objectContaining({
        pharmacyId: 'p1',
        pharmacyName: 'Pharma Nord',
        count: 2,
        hours: 15,
        ca: 600,
        marge: 140,
      }),
    ])
  })

  it('computes CA/h and Marge/h from Pharmacy totals', () => {
    expect(
      buildInterimPharmacyAggregates([
        row({ hours: 10, amountHt: 400, marge: 100 }),
        row({ financeLineId: 'l2', hours: 5, amountHt: 200, marge: 50 }),
      ])[0],
    ).toMatchObject({ caPerHour: 40, margePerHour: 10 })
  })

  it('returns 0 CA/h and Marge/h when hours are 0', () => {
    expect(
      buildInterimPharmacyAggregates([row({ hours: 0, amountHt: 400, marge: 100 })])[0],
    ).toMatchObject({ caPerHour: 0, margePerHour: 0 })
  })

  it('keeps the most recent mission date per Pharmacy', () => {
    expect(
      buildInterimPharmacyAggregates([
        row({ acceptedAt: new Date('2026-07-01T00:00:00Z') }),
        row({ financeLineId: 'l2', acceptedAt: new Date('2026-08-15T00:00:00Z') }),
      ])[0]?.lastDate,
    ).toEqual(new Date('2026-08-15T00:00:00Z'))
  })

  it('sorts Pharmacies by CA descending', () => {
    expect(
      buildInterimPharmacyAggregates([
        row({ pharmacyId: 'p-small', pharmacyName: 'Sud', amountHt: 200 }),
        row({
          financeLineId: 'l2',
          pharmacyId: 'p-big',
          pharmacyName: 'Nord',
          amountHt: 800,
        }),
      ]).map((item) => item.pharmacyId),
    ).toEqual(['p-big', 'p-small'])
  })
})
