import { DEVIS_KIND_LABELS } from '@/view-models/devis-copy'
import { buildDevisPdfLine, type DevisPdfLine } from '@/view-models/devis-pdf-line'
import { formatDevisPdfDate } from '@/view-models/devis-pdf-format'
import { roundMoney } from '@/lib/finance/calculate-interim-libre'
import type { DevisKind } from '@/lib/finance/devis-draft'

export type DevisPdfDestinataire = {
  pharmacyName: string
  contactName: string | null
}

export type DevisPdfModel = {
  destinataire: DevisPdfDestinataire
  kindLabel: string
  hours: number | null
  hourlyRate: number | null
  amountHt: number | null
  amountTtc: number | null
  tvaAmount: number | null
  missionTitle: string
  issuedLabel: string
  line: DevisPdfLine
}

export type DevisPdfInput = {
  pharmacyName: string
  contactName: string | null
  kind: DevisKind
  hours: number | null
  hourlyRate: number | null
  amountHt: number | null
  amountTtc: number | null
  missionTitle: string
  issuedAt?: Date
}

export function buildDevisPdfModel(input: DevisPdfInput): DevisPdfModel {
  const ht = input.amountHt
  const ttc = input.amountTtc
  return {
    destinataire: {
      pharmacyName: input.pharmacyName,
      contactName: input.contactName,
    },
    kindLabel: DEVIS_KIND_LABELS[input.kind],
    hours: input.hours,
    hourlyRate: input.hourlyRate,
    amountHt: ht,
    amountTtc: ttc,
    tvaAmount: ht == null || ttc == null ? null : roundMoney(ttc - ht),
    missionTitle: input.missionTitle,
    issuedLabel: formatDevisPdfDate(input.issuedAt ?? new Date()),
    line: buildDevisPdfLine(input),
  }
}

export function contactDisplayName(
  contact: { firstName: string; lastName: string } | null,
): string | null {
  if (!contact) return null
  const name = `${contact.firstName} ${contact.lastName}`.trim()
  return name || null
}
