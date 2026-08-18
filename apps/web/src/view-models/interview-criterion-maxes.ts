import type { InterviewScoringQuestion } from '@/view-models/interview-scoring-catalog'

export function interviewCriterionMaxes(
  catalog: InterviewScoringQuestion[],
): Record<string, number> {
  const maxes: Record<string, number> = {}
  for (const question of catalog) {
    const criterion = question.mainCritere
    if (!criterion) continue
    const max = Math.max(0, ...question.suggestedAnswers.map((answer) => answer.points))
    maxes[criterion] = (maxes[criterion] ?? 0) + max
  }
  return maxes
}
