import { describe, expect, it } from 'vitest'
import { listFinanceLines } from '@/lib/finance/list-finance-lines'
import type { FinanceLineRecord } from '@/view-models/finance-line'

const interimLine: FinanceLineRecord = {
  id: 'line-i',
  kind: 'INTERIM',
  pharmacyId: 'p1',
  pharmacyName: 'Pharma Nord',
  candidateId: 'c1',
  candidateName: 'Ada Lovelace',
  jobTitle: 'Pharmacien',
  missionId: null,
  devisId: null,
  hours: 12,
  hourlyRate: 40,
  amountHt: 480,
  htSource: 'ENGINE',
  marge: 120,
  occurredAt: new Date('2026-08-01T00:00:00Z'),
  devisStatus: null,
  referentId: null,
  referentName: null,
  placementContractType: null,
  cancelled: false,
  invoiced: false,
  paid: false,
}

describe('listFinanceLines Intérim hours', () => {
  it('exposes hours already stored on the Ligne de suivi', () => {
    const rows = listFinanceLines([interimLine], { kind: 'INTERIM' })
    expect(rows[0]).toMatchObject({ financeLineId: 'line-i', hours: 12 })
  })
})
