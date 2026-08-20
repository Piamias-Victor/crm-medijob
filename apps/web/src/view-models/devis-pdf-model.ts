import { DEVIS_KIND_LABELS } from '@/view-models/devis-copy'
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
  missionTitle: string
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
}

export function buildDevisPdfModel(input: DevisPdfInput): DevisPdfModel {
  return {
    destinataire: {
      pharmacyName: input.pharmacyName,
      contactName: input.contactName,
    },
    kindLabel: DEVIS_KIND_LABELS[input.kind],
    hours: input.hours,
    hourlyRate: input.hourlyRate,
    amountHt: input.amountHt,
    amountTtc: input.amountTtc,
    missionTitle: input.missionTitle,
  }
}

export function contactDisplayName(
  contact: { firstName: string; lastName: string } | null,
): string | null {
  if (!contact) return null
  const name = `${contact.firstName} ${contact.lastName}`.trim()
  return name || null
}
