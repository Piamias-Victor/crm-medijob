import { contactDisplayName } from '@/view-models/devis-pdf-model'
import type { DevisContactRef } from '@/view-models/devis-mission-ref'

export type DevisDestinataire = {
  contactName: string | null
  email: string
}

export function resolveDevisDestinataire(
  missionContact: DevisContactRef | null,
  primary: DevisContactRef | null,
): DevisDestinataire {
  const contact = missionContact ?? primary
  const email = missionContact?.email?.trim() || primary?.email?.trim() || ''
  return { contactName: contactDisplayName(contact), email }
}
