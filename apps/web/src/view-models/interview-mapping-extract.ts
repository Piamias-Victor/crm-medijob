import { INTERVIEW_AVAILABLE_NOW } from '@/view-models/interview-copy'
import {
  interviewQuestionKind,
  isIsoDateChoice,
  splitChoiceLabels,
} from '@/view-models/interview-question-kind'
import type { InterviewDraftAnswers } from '@/view-models/interview-draft.schema'

export type MappingQuestion = { id: string; question: string }

function choice(answers: InterviewDraftAnswers, questions: MappingQuestion[], kind: string) {
  const question = questions.find((item) => interviewQuestionKind(item.question) === kind)
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
  const question = questions.find((item) => item.question.toLowerCase().includes('distance'))
  const label = question ? answers.questions[question.id]?.choiceLabel : undefined
  const match = label?.match(/(\d+)/)
  return match ? Number(match[1]) : undefined
}

export function extractSalaryExpectations(
  answers: InterviewDraftAnswers,
  questions: MappingQuestion[],
): string | undefined {
  const question = questions.find((item) => item.question.toLowerCase().includes('salarial'))
  if (!question) return undefined
  const answer = answers.questions[question.id]
  const text = answer?.note?.trim() || answer?.choiceLabel?.trim()
  return text || undefined
}
