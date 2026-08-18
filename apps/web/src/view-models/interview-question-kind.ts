import {
  pertinentChipsAreExclusive,
  pertinentInterviewChips,
} from '@/view-models/interview-pertinent-chips'

export type InterviewQuestionKind = 'choice' | 'software' | 'availability' | 'multi'

export function interviewQuestionKind(prompt: string): InterviewQuestionKind {
  const text = prompt.toLowerCase()
  if (text.includes('logiciel')) return 'software'
  if (text.includes('à partir de quand')) return 'availability'
  if (pertinentInterviewChips(prompt)) {
    return pertinentChipsAreExclusive(prompt) ? 'choice' : 'multi'
  }
  return 'choice'
}

export function splitChoiceLabels(choiceLabel?: string): string[] {
  return choiceLabel ? choiceLabel.split(', ').filter(Boolean) : []
}

export function joinChoiceLabels(labels: string[]): string {
  return labels.join(', ')
}

export function selectedChoiceValues(
  choiceLabel: string | undefined,
  exclusive: boolean,
): string[] {
  if (exclusive) return choiceLabel ? [choiceLabel] : []
  return splitChoiceLabels(choiceLabel)
}

export function persistChoiceValues(values: string[], exclusive: boolean): string {
  if (exclusive) return values[0] ?? ''
  return joinChoiceLabels(values)
}

export function isIsoDateChoice(value?: string): boolean {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value))
}
