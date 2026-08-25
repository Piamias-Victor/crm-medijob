import { isPlacementContractType } from '@/view-models/finance-line-placement'
import type { FinanceLineRecord } from '@/view-models/finance-line'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

export function toFinanceLineSuiviRow(line: FinanceLineRecord): FacturationSuiviRow {
  const contractType =
    line.kind === 'INTERIM'
      ? 'INTERIM'
      : isPlacementContractType(line.placementContractType)
        ? line.placementContractType
        : 'CDD'
  return {
    missionId: line.missionId,
    financeLineId: line.id,
    pharmacyId: line.pharmacyId,
    pharmacyName: line.pharmacyName,
    candidateName: line.candidateName,
    jobTitle: line.jobTitle,
    lineKind: line.kind,
    devisId: line.devisId,
    devisStatus: line.devisStatus,
    referentId: line.referentId,
    referentName: line.referentName,
    contractType,
    commercialStatus: 'ACCEPTE',
    sentAt: null,
    acceptedAt: line.occurredAt,
    hours: line.hours,
    amountHt: line.amountHt,
    marge: line.marge,
    cancelled: line.cancelled,
    invoiced: line.invoiced,
    paid: line.paid,
  }
}
