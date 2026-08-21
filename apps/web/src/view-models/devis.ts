import type { DevisKind, HtSource } from '@/lib/finance/devis-draft'
import { pickCurrentDevis } from '@/lib/finance/pick-current-devis'

export type DevisStatus = 'DRAFT' | 'SENT' | 'ACCEPTED'

export type DevisRecord = {
  id: string
  missionId: string | null
  kind: DevisKind
  status: DevisStatus
  hours: number | null
  hourlyRate: number | null
  amountHt: number | null
  amountTtc: number | null
  htSource: HtSource
  sentAt: Date | null
  acceptedAt: Date | null
  invoicedAt: Date | null
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
  acceptedAt: Date | null
  invoicedAt: Date | null
}

export type DevisWriteFields = Omit<
  DevisRecord,
  'id' | 'status' | 'sentAt' | 'acceptedAt' | 'invoicedAt' | 'updatedAt' | 'missionId'
>

export type DevisMissionView = {
  draft: DevisView | null
  current: DevisView | null
}

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
    acceptedAt: row.acceptedAt,
    invoicedAt: row.invoicedAt,
  }
}

export function toDevisMissionView(rows: DevisRecord[]): DevisMissionView {
  const draft = rows.find((row) => row.status === 'DRAFT') ?? null
  const current = pickCurrentDevis(rows)
  return {
    draft: draft ? toDevisView(draft) : null,
    current: current ? toDevisView(current) : null,
  }
}
