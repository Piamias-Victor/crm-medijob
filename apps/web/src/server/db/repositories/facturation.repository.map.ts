import type { DevisRecord } from '@/view-models/devis'
import type { FacturationMissionRecord } from '@/view-models/facturation-suivi'
import type { FacturationMissionQueryRow } from '@/server/db/repositories/facturation.repository.select'

function toDevisRecord(row: FacturationMissionQueryRow['devis'][number]): DevisRecord {
  return {
    id: row.id,
    missionId: row.missionId,
    kind: row.kind,
    status: row.status,
    hours: row.hours,
    hourlyRate: row.hourlyRate,
    amountHt: row.amountHt,
    amountTtc: row.amountTtc,
    htSource: row.htSource,
    sentAt: row.sentAt,
    acceptedAt: row.acceptedAt,
    invoicedAt: row.invoicedAt,
    updatedAt: row.updatedAt,
  }
}

export function toFacturationMissionRecord(row: FacturationMissionQueryRow): FacturationMissionRecord {
  return {
    id: row.id,
    pharmacyId: row.pharmacyId,
    pharmacyName: row.pharmacy.name,
    referentId: row.referentId,
    referentName: row.referent?.name ?? null,
    contractType: row.contractType,
    status: row.status,
    marge: row.marge,
    devis: row.devis.map(toDevisRecord),
  }
}
