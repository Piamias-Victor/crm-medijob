import { INTERVIEW_AVAILABLE_NOW } from '@/view-models/interview-copy'
import { isIsoDateChoice, splitChoiceLabels } from '@/view-models/interview-question-kind'
import {
  resolveCloseMapping,
  type InterviewCloseMapping,
} from '@/view-models/interview-close-mapping'
import type { InterviewDraftAnswers } from '@/view-models/interview-draft.schema'

export type MappingQuestion = {
  id: string
  question: string
  mapping?: InterviewCloseMapping | null
}

function mapped(
  questions: MappingQuestion[],
  kind: InterviewCloseMapping,
): MappingQuestion | undefined {
  return questions.find((item) => resolveCloseMapping(item) === kind)
}

function choice(
  answers: InterviewDraftAnswers,
  questions: MappingQuestion[],
  kind: InterviewCloseMapping,
) {
  const question = mapped(questions, kind)
  return question ? answers.questions[question.id]?.choiceLabel : undefined
}

export function extractAvailableFrom(
  answers: InterviewDraftAnswers,
  questions: MappingQuestion[],
): Date | null | undefined {
  const label = choice(answers, questions, 'availability')
  if (isIsoDateChoice(label)) return new Date(`${label}T00:00:00.000Z`)
  if (label === INTERVIEW_AVAILABLE_NOW) return null
  return undefined
}

export function extractSoftwareNames(
  answers: InterviewDraftAnswers,
  questions: MappingQuestion[],
): string[] | undefined {
  const label = choice(answers, questions, 'software')
  if (!label) return undefined
  const names = splitChoiceLabels(label)
  return names.length ? names : undefined
}

export function extractMobilityRadiusKm(
  answers: InterviewDraftAnswers,
  questions: MappingQuestion[],
): number | undefined {
  const question = mapped(questions, 'mobility')
  const label = question ? answers.questions[question.id]?.choiceLabel : undefined
  const match = label?.match(/(\d+)/)
  return match ? Number(match[1]) : undefined
}

export function extractSalaryExpectations(
  answers: InterviewDraftAnswers,
  questions: MappingQuestion[],
): string | undefined {
  const question = mapped(questions, 'salary')
  if (!question) return undefined
  const answer = answers.questions[question.id]
  const text = answer?.note?.trim() || answer?.choiceLabel?.trim()
  return text || undefined
}

export function shouldMapContracts(questions: MappingQuestion[]): boolean {
  const explicit = questions.some((item) => item.mapping != null)
  if (!explicit) return true
  return questions.some((item) => item.mapping === 'contracts')
}
