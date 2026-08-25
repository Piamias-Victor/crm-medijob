import type { FinanceLineRecord } from '@/view-models/finance-line'

export function pilotageLine(
  partial: Partial<FinanceLineRecord> & Pick<FinanceLineRecord, 'id'>,
): FinanceLineRecord {
  return {
    kind: 'PLACEMENT',
    pharmacyId: 'p1',
    pharmacyName: 'Pharma Nord',
    candidateId: 'c1',
    candidateName: 'Ada',
    jobTitle: 'Pharmacien',
    missionId: null,
    devisId: null,
    hours: null,
    hourlyRate: null,
    amountHt: 5000,
    htSource: 'TYPED',
    marge: 1500,
    occurredAt: new Date('2026-08-01T00:00:00Z'),
    devisStatus: null,
    referentId: 'u-alice',
    referentName: 'Alice',
    placementContractType: 'CDD',
    cancelled: false,
    invoiced: false,
    paid: false,
    ...partial,
  }
}
