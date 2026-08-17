import type { InterviewDecision } from '@prisma/client'
import type { InterviewDraftAnswers } from '@/view-models/interview-draft.schema'
import type { InterviewScoringQuestion } from '@/view-models/interview-scoring-catalog'

export const INTERVIEW_ELIGIBLE_MIN_RATIO = 0.7
export const INTERVIEW_REVIEW_MIN_RATIO = 0.4

function catalogMax(catalog: InterviewScoringQuestion[]): number {
  return catalog.reduce((sum, question) => {
    if (!question.mainCritere) return sum
    const max = Math.max(0, ...question.suggestedAnswers.map((answer) => answer.points))
    return sum + max
  }, 0)
}

function eliminatoryFail(
  catalog: InterviewScoringQuestion[],
  answers: InterviewDraftAnswers,
): boolean {
  return catalog.some((question) => {
    if (!question.eliminatoire) return false
    const label = answers.questions[question.id]?.choiceLabel
    return question.suggestedAnswers.some((answer) => answer.label === label && answer.tone === 'weak')
  })
}

export function suggestInterviewDecision(
  scores: Record<string, number>,
  catalog: InterviewScoringQuestion[],
  answers: InterviewDraftAnswers,
): InterviewDecision {
  if (eliminatoryFail(catalog, answers)) return 'NON_ELIGIBLE'
  const possible = catalogMax(catalog)
  const earned = Object.values(scores).reduce((sum, value) => sum + value, 0)
  if (possible > 0 && earned / possible >= INTERVIEW_ELIGIBLE_MIN_RATIO) return 'ELIGIBLE'
  if (possible > 0 && earned / possible >= INTERVIEW_REVIEW_MIN_RATIO) return 'REVIEW'
  return 'NON_ELIGIBLE'
}
