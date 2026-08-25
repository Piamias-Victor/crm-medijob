import { describe, expect, it } from 'vitest'
import {
  defaultFinanceLineFormValues,
  financeLineFormSchema,
  toCreateFinanceLineInput,
} from '@/view-models/finance-line-form'
import { filterMissionsForPharmacy } from '@/view-models/filter-missions-for-pharmacy'
import { placementTypeFromMission } from '@/view-models/finance-line-placement'
import type { FacturationMissionOption } from '@/view-models/finance-line'

describe('finance line form', () => {
  it('sends null Mission when the field is empty', () => {
    const input = toCreateFinanceLineInput({
      pharmacyId: 'p1',
      candidateId: 'c1',
      missionId: '',
      kind: 'PLACEMENT',
      placementContractType: 'CDD',
      referentId: '',
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
    expect(input.referentId).toBeNull()
  })

  it('sends Placement CDI, CA 0 and a Referent', () => {
    const input = toCreateFinanceLineInput({
      pharmacyId: 'p1',
      candidateId: 'c1',
      missionId: '',
      kind: 'PLACEMENT',
      placementContractType: 'CDI',
      referentId: 'u-alice',
      hours: '',
      hourlyRate: '',
      amountHt: '0',
      htSource: 'TYPED',
      marge: '',
      occurredAt: '2026-08-01',
    })
    expect(input.placementContractType).toBe('CDI')
    expect(input.referentId).toBe('u-alice')
    expect(input.amountHt).toBe(0)
  })

  it('keeps hours and rate when typed', () => {
    const input = toCreateFinanceLineInput({
      pharmacyId: 'p1',
      candidateId: 'c1',
      missionId: 'm1',
      kind: 'INTERIM',
      placementContractType: '',
      referentId: '',
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

  it('prefills CDD or CDI from a Mission, not intérim', () => {
    expect(placementTypeFromMission('CDI')).toBe('CDI')
    expect(placementTypeFromMission('INTERIM')).toBe('')
  })

  it('rejects Placement form without CDD or CDI', () => {
    expect(() =>
      financeLineFormSchema.parse({
        ...defaultFinanceLineFormValues(),
        pharmacyId: 'p1',
        candidateId: 'c1',
        amountHt: '0',
      }),
    ).toThrow()
  })
})

describe('filterMissionsForPharmacy', () => {
  const missions: FacturationMissionOption[] = [
    { id: 'm1', title: 'Nord', pharmacyId: 'p1', contractType: 'CDD' },
    { id: 'm2', title: 'Sud', pharmacyId: 'p2', contractType: 'CDI' },
  ]

  it('keeps only missions of the selected pharmacy', () => {
    expect(filterMissionsForPharmacy(missions, 'p1').map((row) => row.id)).toEqual(['m1'])
  })
})
