import type { DevisKind, HtSource } from '@/lib/finance/devis-draft'

export type DevisStatus = 'DRAFT' | 'SENT' | 'ACCEPTED'

export type DevisRecord = {
  id: string
  missionId: string
  kind: DevisKind
  status: DevisStatus
  hours: number | null
  hourlyRate: number | null
  amountHt: number | null
  amountTtc: number | null
  htSource: HtSource
  updatedAt: Date
}

export type DevisView = {
  id: string
  kind: DevisKind
  status: DevisStatus
  hours: number | null
  hourlyRate: number | null
  amountHt: number | null
  amountTtc: number | null
  htSource: HtSource
}

export type DevisWriteFields = Omit<DevisRecord, 'id' | 'status' | 'updatedAt' | 'missionId'>

export function toDevisView(row: DevisRecord): DevisView {
  return {
    id: row.id,
    kind: row.kind,
    status: row.status,
    hours: row.hours,
    hourlyRate: row.hourlyRate,
    amountHt: row.amountHt,
    amountTtc: row.amountTtc,
    htSource: row.htSource,
  }
}
