import { buildPrompt } from './prompt'
import { parseAssistantResponse } from './parse'
import type { AssistantProvider } from './provider'
import type { OfferDraft, OfferResponse } from './schemas'
import { formatBoardOfferTitle } from '@/server/job-board/format-board-offer'
import { renderOfferSectionsHtml } from '@/server/job-board/render-offer-sections'

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
    `Type de contrat : ${mission.contractType}`,
    `Ville : ${mission.pharmacy.city ?? 'non précisée'}`,
    mission.planning ? `Planning : ${mission.planning}` : null,
    mission.heuresParSemaine != null ? `Heures/semaine : ${mission.heuresParSemaine}` : null,
    salary ? `Rémunération : ${salary}` : null,
    mission.pharmacy.software ? `Logiciel : ${mission.pharmacy.software.name}` : null,
    mission.profilRecherche ? `Profil recherché : ${mission.profilRecherche}` : null,
    mission.description ? `Description mission : ${mission.description}` : null,
    mission.notes ? `Notes : ${mission.notes}` : null,
    `Début : ${String(mission.startDate)}`,
  ]
    .filter(Boolean)
    .join('\n')

  return buildPrompt({
    kind: 'offer',
    instruction:
      'Remplis resume (1 paragraphe), missions[], profil[], infos[] (contrat, horaires, rémunération). Pas de HTML.',
    contextText: context,
  })
}

async function parseOfferSections(
  provider: AssistantProvider,
  prompt: string,
): Promise<OfferResponse> {
  try {
    const raw = await provider.complete({ prompt, kind: 'offer' })
    return parseAssistantResponse('offer', raw) as OfferResponse
  } catch {
    const raw = await provider.complete({ prompt, kind: 'offer' })
    return parseAssistantResponse('offer', raw) as OfferResponse
  }
}

export async function runJobOfferGenerate(
  provider: AssistantProvider,
  mission: MissionOfferContext,
): Promise<OfferDraft> {
  const sections = await parseOfferSections(provider, buildJobOfferPrompt(mission))
  return {
    title: formatBoardOfferTitle(mission.jobTitle.name),
    content: renderOfferSectionsHtml(sections),
  }
}
