import { buildPrompt } from './prompt'
import { parseAssistantResponse } from './parse'
import type { AssistantProvider } from './provider'
import type { AnonymizedProfileResponse } from './schemas'
import { assertAnonymizedDossierSafe } from './candidate-anonymized-pii-dossier'
import type { AnonymizedDossier } from '@/view-models/anonymized-dossier.schema'

export type CandidateAnonymizedInput = {
  cvSummary: string
  jobTitleName: string
  softwareNames: string[]
  mobilityRadiusKm: number | null
  mobilityNotes: string | null
  availableFrom: Date | string | null
  forbiddenTokens: string[]
}

function formatAvailability(value: Date | string | null): string | null {
  if (!value) return 'Disponible immédiatement'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('fr-FR')
}

export function buildCandidateAnonymizedPrompt(input: CandidateAnonymizedInput): string {
  const context = [
    `Résumé professionnel :\n${input.cvSummary}`,
    `Métier : ${input.jobTitleName}`,
    input.softwareNames.length > 0 ? `Logiciels : ${input.softwareNames.join(', ')}` : null,
    input.mobilityRadiusKm !== null ? `Rayon de mobilité : ${input.mobilityRadiusKm} km` : null,
    input.mobilityNotes ? `Notes mobilité : ${input.mobilityNotes}` : null,
    `Disponibilité : ${formatAvailability(input.availableFrom) ?? 'Non renseignée'}`,
  ]
    .filter(Boolean)
    .join('\n')

  return buildPrompt({
    kind: 'anonymized',
    instruction:
      'Rédige un dossier candidat anonymisé (français) pour un client. Remplis les 6 champs texte. Zéro nom, email, téléphone, adresse postale ou identifiant personnel. Laisse "" si non renseigné.',
    contextText: context,
  })
}

export async function runCandidateAnonymized(
  provider: AssistantProvider,
  input: CandidateAnonymizedInput,
): Promise<AnonymizedDossier> {
  const prompt = buildCandidateAnonymizedPrompt(input)
  const raw = await provider.complete({ prompt, kind: 'anonymized' })
  const data = parseAssistantResponse('anonymized', raw) as AnonymizedProfileResponse
  assertAnonymizedDossierSafe(data, input.forbiddenTokens)
  return data
}
