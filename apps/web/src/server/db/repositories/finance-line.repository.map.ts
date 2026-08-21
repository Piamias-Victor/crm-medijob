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
    amountHt: row.amountHt,
    marge: row.marge,
    occurredAt: row.occurredAt,
  }
}
