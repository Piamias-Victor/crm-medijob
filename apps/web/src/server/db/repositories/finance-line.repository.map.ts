import { isPlacementContractType } from '@/view-models/finance-line-placement'
import type { FinanceLineRecord } from '@/view-models/finance-line'
import type { FinanceLineQueryRow } from '@/server/db/repositories/finance-line.repository.select'

export function toFinanceLineRecord(row: FinanceLineQueryRow): FinanceLineRecord {
  return {
    id: row.id,
    kind: row.kind,
    pharmacyId: row.pharmacyId,
    pharmacyName: row.pharmacy.name,
    candidateId: row.candidateId,
    candidateName: `${row.candidate.firstName} ${row.candidate.lastName}`.trim(),
    missionId: row.missionId,
    devisId: row.devisId,
    hours: row.hours,
    hourlyRate: row.hourlyRate,
    amountHt: row.amountHt,
    htSource: row.htSource,
    marge: row.marge,
    occurredAt: row.occurredAt,
    devisStatus: row.devis?.status ?? null,
    referentId: row.referentId,
    referentName: row.referent?.name ?? null,
    placementContractType: isPlacementContractType(row.placementContractType)
      ? row.placementContractType
      : null,
    cancelled: row.cancelled,
    invoiced: row.invoiced,
    paid: row.paid,
  }
}
