import { describe, expect, it } from 'vitest'
import { facturationLineTotals } from '@/view-models/facturation-line-totals'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

function row(overrides: Partial<FacturationSuiviRow>): FacturationSuiviRow {
  return {
    missionId: null,
    financeLineId: 'l1',
    pharmacyId: 'p1',
    pharmacyName: 'Pharma Nord',
    referentId: null,
    referentName: null,
    contractType: 'CDD',
    commercialStatus: 'ACCEPTE',
    sentAt: null,
    acceptedAt: new Date('2026-08-01T00:00:00Z'),
    amountHt: 5000,
    marge: 1500,
    ...overrides,
  }
}

describe('facturationLineTotals', () => {
  it('sums CA and Marge of the filtered list', () => {
    expect(
      facturationLineTotals([
        row({ amountHt: 5000, marge: 1500 }),
        row({ financeLineId: 'l2', amountHt: 2000, marge: 400 }),
      ]),
    ).toEqual({ count: 2, ca: 7000, marge: 1900 })
  })
})
