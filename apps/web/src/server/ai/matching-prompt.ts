import type { MatchingCandidateInput, MatchingMissionInput } from '@/server/matching/matching-input.types'
import { formatSalaryExpectations } from '@/view-models/format-salary-expectations'

type MissionPrompt = Pick<
  MatchingMissionInput,
  'contractType' | 'startDate'
> & {
  title: string
  jobTitleName: string
  pharmacyName: string
  pharmacyCity: string | null
  description: string | null
}

function candidateSalaryLine(c: MatchingCandidateInput): string | null {
  const text = c.salaryExpectations?.trim()
  if (text) {
    const range =
      c.salaryMin != null || c.salaryMax != null
        ? ` (${c.salaryMin ?? '—'}–${c.salaryMax ?? '—'})`
        : ''
    return `Prétentions: ${text}${range}`
  }
  const label = formatSalaryExpectations(c)
  return label ? `Prétentions: ${label}` : null
}

export function buildMatchingPrompt(mission: MissionPrompt, candidates: MatchingCandidateInput[]) {
  const missionBlock = [
    `Mission: ${mission.title}`,
    `Métier: ${mission.jobTitleName}`,
    `Pharmacie: ${mission.pharmacyName}${mission.pharmacyCity ? ` (${mission.pharmacyCity})` : ''}`,
    `Contrat: ${mission.contractType}`,
    `Début: ${mission.startDate.toISOString().slice(0, 10)}`,
    mission.description ? `Description: ${mission.description}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const candidatesBlock = candidates
    .map(
      (c, index) =>
        [
          `#${index + 1} id=${c.id}`,
          `Nom: ${c.firstName} ${c.lastName}`,
          `Métier: ${c.jobTitleName}`,
          `Ville: ${c.city ?? '—'} ${c.postalCode ?? ''}`.trim(),
          `Contrats souhaités: ${c.preferredContractTypes.join(', ') || 'non renseigné'}`,
          `Dispo: ${c.availableFrom?.toISOString().slice(0, 10) ?? 'immédiate'}`,
          candidateSalaryLine(c),
        ]
          .filter(Boolean)
          .join('\n'),
    )
    .join('\n\n')

  return [
    'Tu es un assistant recrutement officine. Score chaque candidat 0-100 pour la mission.',
    'Prends en compte les prétentions salariales comme signal de compatibilité (pas d’exclusion).',
    'Réponds UNIQUEMENT en JSON object: { "scores": [{ "candidateId", "score", "justification" }] }.',
    missionBlock,
    'Candidats:',
    candidatesBlock,
  ].join('\n\n')
}
