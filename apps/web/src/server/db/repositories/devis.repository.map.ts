import type { DevisRecord } from '@/view-models/devis'

type Row = {
  id: string
  missionId: string | null
  kind: DevisRecord['kind']
  status: DevisRecord['status']
  hours: number | null
  hourlyRate: number | null
  amountHt: number | null
  amountTtc: number | null
  htSource: DevisRecord['htSource']
  sentAt: Date | null
  acceptedAt: Date | null
  invoicedAt: Date | null
  updatedAt: Date
}

export function toDevisRecord(row: Row): DevisRecord {
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
