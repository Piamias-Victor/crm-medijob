import { buildPrompt } from '@/server/ai/prompt'
import { formatPharmacy, formatPresentCandidate, type PharmacyLike } from '@/server/ai/format-entity'

export type PresentCandidateInput = {
  candidate: {
    firstName: string
    lastName: string
    jobTitleName: string
    softwareNames: string[]
    city: string | null
    mobilityRadiusKm: number | null
    mobilityNotes: string | null
    notes: string | null
    cvSummary: string | null
    availableFrom?: Date | string | null
  }
  pharmacy: PharmacyLike
}

export function buildPresentCandidatePrompt(input: PresentCandidateInput): string {
  const context = `${formatPresentCandidate(input.candidate)}\n\n${formatPharmacy(input.pharmacy)}`
  const contact = input.pharmacy.contactName?.trim() || input.pharmacy.contactEmail || 'le contact pharmacie'

  return buildPrompt({
    kind: 'email',
    instruction:
      `Rédige un email professionnel en français pour présenter ce candidat à cette pharmacie cliente. ` +
      `Destinataire = ${contact} (contact officine) — salue CE contact, jamais le candidat. ` +
      `Parle du candidat à la 3e personne. Ton chaleureux, concis, orienté valeur pour l’officine.`,
    contextText: context,
  })
}
