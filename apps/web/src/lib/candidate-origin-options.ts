export const CANDIDATE_ORIGINS = ['APP', 'CRM'] as const

export type CandidateOriginValue = (typeof CANDIDATE_ORIGINS)[number]

export const CANDIDATE_ORIGIN_LABELS: Record<CandidateOriginValue, string> = {
  APP: 'App',
  CRM: 'CRM',
}

export const candidateOriginOptions = CANDIDATE_ORIGINS.map((value) => ({
  value,
  label: CANDIDATE_ORIGIN_LABELS[value],
}))
