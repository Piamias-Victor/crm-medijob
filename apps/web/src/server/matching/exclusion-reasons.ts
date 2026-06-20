export const EXCLUSION_REASONS = {
  job_title: 'Métier incompatible avec la mission',
  geo: 'Localisation incomplète (ville ou code postal manquant)',
  distance: 'Hors rayon de mobilité',
  contract: 'Type de contrat non souhaité',
  availability: 'Indisponible avant le début de mission',
  not_scored: 'Non évalué par l’IA (limite de scoring atteinte)',
} as const

export type ExclusionReasonCode = keyof typeof EXCLUSION_REASONS

export function exclusionReasonLabel(code: ExclusionReasonCode): string {
  return EXCLUSION_REASONS[code]
}
