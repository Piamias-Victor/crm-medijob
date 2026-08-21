import { describe, expect, it } from 'vitest'
import { toCreateFinanceLineInput } from '@/view-models/finance-line-form'
import { filterMissionsForPharmacy } from '@/view-models/filter-missions-for-pharmacy'
import { canGenerateDevisFromRow } from '@/view-models/facturation-line-actions'

describe('finance line form', () => {
  it('sends null Mission when the field is empty', () => {
    const input = toCreateFinanceLineInput({
      pharmacyId: 'p1',
      candidateId: 'c1',
      missionId: '',
      kind: 'PLACEMENT',
      amountHt: '5000',
      marge: '1500',
      occurredAt: '2026-08-01',
    })
    expect(input.missionId).toBeNull()
    expect(input.amountHt).toBe(5000)
  })
})

describe('filterMissionsForPharmacy', () => {
  const missions = [
    { id: 'm1', title: 'Nord', pharmacyId: 'p1' },
    { id: 'm2', title: 'Sud', pharmacyId: 'p2' },
  ]

  it('keeps only missions of the selected pharmacy', () => {
    expect(filterMissionsForPharmacy(missions, 'p1').map((row) => row.id)).toEqual(['m1'])
  })
})

describe('canGenerateDevisFromRow', () => {
  it('allows generate only for a line with Mission and no Devis yet', () => {
    expect(
      canGenerateDevisFromRow({
        missionId: 'm1',
        financeLineId: 'l1',
        devisId: null,
        pharmacyId: 'p1',
        pharmacyName: 'Nord',
        referentId: null,
        referentName: null,
        contractType: 'CDD',
        commercialStatus: 'ACCEPTE',
        sentAt: null,
        acceptedAt: null,
        amountHt: 5000,
      }),
    ).toBe(true)
  })
})
