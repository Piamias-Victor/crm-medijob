import type { DevisKind } from '@/lib/finance/devis-draft'
import { DEVIS_KIND_LABELS } from '@/view-models/devis-copy'

export function devisComposeSubject(missionTitle: string, pharmacyName: string): string {
  return `Devis ${missionTitle} — ${pharmacyName}`
}

export function devisComposeBody(contactName: string | null, kind: DevisKind): string {
  const hello = contactName ? `Bonjour ${contactName},` : 'Bonjour,'
  return `${hello}\n\nVeuillez trouver ci-joint notre devis ${DEVIS_KIND_LABELS[kind]}.\n\nCordialement`
}
