import { isPlacementContractType } from '@/view-models/finance-line-placement'
import { PHARMACY_UNLINKED_LABEL } from '@/view-models/finance-line-unlinked'
import type { FinanceLineRecord } from '@/view-models/finance-line'
import type { FinanceLineQueryRow } from '@/server/db/repositories/finance-line.repository.select'

function candidateDisplay(row: FinanceLineQueryRow): string {
  if (row.candidate) {
    return `${row.candidate.firstName} ${row.candidate.lastName}`.trim()
  }
  return row.candidateLabel?.trim() || '—'
}

export function toFinanceLineRecord(row: FinanceLineQueryRow): FinanceLineRecord {
  return {
    id: row.id,
    kind: row.kind,
    source: row.source,
    pharmacyId: row.pharmacyId,
    pharmacyName: row.pharmacy?.name ?? row.pharmacyLabel?.trim() ?? PHARMACY_UNLINKED_LABEL,
    pharmacyLabel: row.pharmacyLabel,
    candidateId: row.candidateId,
    candidateName: candidateDisplay(row),
    candidateLabel: row.candidateLabel,
    referentLabel: row.referentLabel,
    importKey: row.importKey,
    jobTitle: row.candidate?.jobTitle.name ?? null,
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
