import type { InterviewDraftAnswers } from '@/view-models/interview-draft.schema'
import type { InterviewScoringQuestion } from '@/view-models/interview-scoring-catalog'
import { pointsForChoice } from '@/view-models/interview-scoring-points'

export function suggestInterviewScores(
  answers: InterviewDraftAnswers,
  catalog: InterviewScoringQuestion[],
): Record<string, number> {
  const scores: Record<string, number> = {}
  for (const question of catalog) {
    const criterion = question.mainCritere
    if (!criterion) continue
    const points = pointsForChoice(question, answers.questions[question.id]?.choiceLabel)
    scores[criterion] = (scores[criterion] ?? 0) + points
  }
  return scores
}
