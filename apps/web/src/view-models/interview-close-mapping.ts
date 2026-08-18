import { interviewQuestionKind } from '@/view-models/interview-question-kind'

export const INTERVIEW_CLOSE_MAPPINGS = [
  'availability',
  'software',
  'mobility',
  'salary',
  'contracts',
  'none',
] as const

export type InterviewCloseMapping = (typeof INTERVIEW_CLOSE_MAPPINGS)[number]

export const INTERVIEW_UNIQUE_MAPPINGS = [
  'availability',
  'software',
  'mobility',
  'salary',
  'contracts',
] as const

export type InterviewUniqueMapping = (typeof INTERVIEW_UNIQUE_MAPPINGS)[number]

export function inferCloseMapping(prompt: string): InterviewCloseMapping {
  const kind = interviewQuestionKind(prompt)
  if (kind === 'software' || kind === 'availability') return kind
  const text = prompt.toLowerCase()
  if (text.includes('distance')) return 'mobility'
  if (text.includes('salarial')) return 'salary'
  return 'none'
}

export function resolveCloseMapping(question: {
  question: string
  mapping?: InterviewCloseMapping | null
}): InterviewCloseMapping {
  return question.mapping ?? inferCloseMapping(question.question)
}

export function parseCloseMapping(value: string): InterviewCloseMapping {
  for (const mapping of INTERVIEW_CLOSE_MAPPINGS) {
    if (mapping === value) return mapping
  }
  return 'none'
}

export const INTERVIEW_CLOSE_MAPPING_LABELS: Record<InterviewCloseMapping, string> = {
  availability: 'Disponibilité',
  software: 'Logiciels',
  mobility: 'Mobilité',
  salary: 'Salaire',
  contracts: 'Contrats',
  none: 'Aucun',
}
