import { describe, expect, it } from 'vitest'
import { toCreateFinanceLineInput } from '@/view-models/finance-line-form'
import { filterMissionsForPharmacy } from '@/view-models/filter-missions-for-pharmacy'
import { canGenerateDevisFromRow, canSendDevisFromRow } from '@/view-models/facturation-line-actions'

describe('finance line form', () => {
  it('sends null Mission when the field is empty', () => {
    const input = toCreateFinanceLineInput({
      pharmacyId: 'p1',
      candidateId: 'c1',
      missionId: '',
      kind: 'PLACEMENT',
      hours: '',
      hourlyRate: '',
      amountHt: '5000',
      htSource: 'TYPED',
      marge: '1500',
      occurredAt: '2026-08-01',
    })
    expect(input.missionId).toBeNull()
    expect(input.amountHt).toBe(5000)
    expect(input.hours).toBeNull()
  })

  it('keeps hours and rate when typed', () => {
    const input = toCreateFinanceLineInput({
      pharmacyId: 'p1',
      candidateId: 'c1',
      missionId: 'm1',
      kind: 'INTERIM',
      hours: '10',
      hourlyRate: '40',
      amountHt: '400',
      htSource: 'ENGINE',
      marge: '',
      occurredAt: '2026-08-01',
    })
    expect(input.hours).toBe(10)
    expect(input.hourlyRate).toBe(40)
    expect(input.htSource).toBe('ENGINE')
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
  it('allows generate for a line with no Devis yet, even without Mission', () => {
    expect(
      canGenerateDevisFromRow({
        missionId: null,
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

  it('allows send when the Devis is not already sent, even without Mission', () => {
    expect(
      canSendDevisFromRow({
        missionId: null,
        financeLineId: 'l1',
        devisId: 'd1',
        devisStatus: 'DRAFT',
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
