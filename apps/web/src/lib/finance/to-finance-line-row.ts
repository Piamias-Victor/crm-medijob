import type { FinanceLineRecord } from '@/view-models/finance-line'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

export function toFinanceLineSuiviRow(line: FinanceLineRecord): FacturationSuiviRow {
  return {
    missionId: line.missionId,
    financeLineId: line.id,
    pharmacyId: line.pharmacyId,
    pharmacyName: line.pharmacyName,
    candidateName: line.candidateName,
    lineKind: line.kind,
    devisId: line.devisId,
    devisStatus: line.devisStatus,
    referentId: null,
    referentName: null,
    contractType: line.kind === 'INTERIM' ? 'INTERIM' : 'CDD',
    commercialStatus: 'ACCEPTE',
    sentAt: null,
    acceptedAt: line.occurredAt,
    amountHt: line.amountHt,
  }
}
