export const INTERVIEW_STATUS_LABELS = {
  DRAFT: 'Brouillon',
  CLOSED: 'Clos',
} as const

export const INTERVIEW_MODE_LABELS = {
  INTERIM: 'Intérim',
  CDD_CDI: 'CDD/CDI',
} as const

export type InterviewModeKey = keyof typeof INTERVIEW_MODE_LABELS

export const INTERVIEW_MODE_OPTIONS = [
  { value: 'INTERIM' as const, label: INTERVIEW_MODE_LABELS.INTERIM },
  { value: 'CDD_CDI' as const, label: INTERVIEW_MODE_LABELS.CDD_CDI },
]

export function parseInterviewMode(value: string): InterviewModeKey {
  return value === 'CDD_CDI' ? 'CDD_CDI' : 'INTERIM'
}

export const INTERVIEW_DECISION_LABELS = {
  ELIGIBLE: 'Éligible',
  NON_ELIGIBLE: 'Non éligible',
  REVIEW: 'À revoir',
} as const
