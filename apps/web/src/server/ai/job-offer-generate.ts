import { buildPrompt } from './prompt'
import { parseAssistantResponse } from './parse'
import type { AssistantProvider } from './provider'
import type { OfferResponse } from './schemas'

export type MissionOfferContext = {
  title: string
  description: string | null
  contractType: string
  startDate: Date | string
  planning: string | null
  salaireMin: number | null
  salaireMax: number | null
  salaireNotes: string | null
  heuresParSemaine: number | null
  profilRecherche: string | null
  notes: string | null
  jobTitle: { name: string }
  pharmacy: {
    name: string
    city: string | null
    notes: string | null
    software: { name: string } | null
  }
}

export function buildJobOfferPrompt(mission: MissionOfferContext): string {
  const salary =
    mission.salaireMin != null || mission.salaireMax != null
      ? `${mission.salaireMin ?? '?'}–${mission.salaireMax ?? '?'}`
      : mission.salaireNotes

  const context = [
    `Poste : ${mission.jobTitle.name}`,
    `Mission : ${mission.title}`,
    `Type de contrat : ${mission.contractType}`,
    `Ville : ${mission.pharmacy.city ?? 'non précisée'}`,
    `Pharmacie : ${mission.pharmacy.name}`,
    mission.planning ? `Planning : ${mission.planning}` : null,
    mission.heuresParSemaine != null ? `Heures/semaine : ${mission.heuresParSemaine}` : null,
    salary ? `Rémunération : ${salary}` : null,
    mission.pharmacy.software ? `Logiciel : ${mission.pharmacy.software.name}` : null,
    mission.profilRecherche ? `Profil recherché : ${mission.profilRecherche}` : null,
    mission.description ? `Description mission : ${mission.description}` : null,
    mission.pharmacy.notes ? `Pharmacie (notes) : ${mission.pharmacy.notes}` : null,
    mission.notes ? `Notes : ${mission.notes}` : null,
    `Début : ${String(mission.startDate)}`,
  ]
    .filter(Boolean)
    .join('\n')

  return buildPrompt({
    kind: 'offer',
    instruction:
      'Rédige une offre d’emploi attractive et complète en français pour le site Medijob, à partir de cette mission.',
    contextText: context,
  })
}

export async function runJobOfferGenerate(
  provider: AssistantProvider,
  mission: MissionOfferContext,
): Promise<OfferResponse> {
  const raw = await provider.complete({ prompt: buildJobOfferPrompt(mission), kind: 'offer' })
  return parseAssistantResponse('offer', raw) as OfferResponse
}
