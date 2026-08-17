export type InterviewQuestionKind = 'choice' | 'software' | 'availability' | 'notes'

const NOTES_MARKERS = [
  'plaît dans le remplacement',
  'type de remplacement recherchez',
  'attentes et vos critères',
  'nouvelle équipe',
]

export function interviewQuestionKind(prompt: string): InterviewQuestionKind {
  const text = prompt.toLowerCase()
  if (text.includes('logiciel')) return 'software'
  if (text.includes('à partir de quand')) return 'availability'
  if (NOTES_MARKERS.some((marker) => text.includes(marker))) return 'notes'
  return 'choice'
}

export function splitChoiceLabels(choiceLabel?: string): string[] {
  return choiceLabel ? choiceLabel.split(', ').filter(Boolean) : []
}

export function joinChoiceLabels(labels: string[]): string {
  return labels.join(', ')
}

export function isIsoDateChoice(value?: string): boolean {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value))
}
