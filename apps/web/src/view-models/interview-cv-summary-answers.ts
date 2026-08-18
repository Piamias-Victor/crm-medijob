import type { InterviewDraftAnswers } from '@/view-models/interview-draft.schema'
import type { InterviewScoringQuestion } from '@/view-models/interview-scoring-catalog'

export function formatInterviewAnswers(
  answers: InterviewDraftAnswers,
  questions: InterviewScoringQuestion[],
): string {
  return questions
    .map((question) => {
      const answer = answers.questions[question.id]
      if (!answer) return null
      const detail = [answer.choiceLabel, answer.note].filter(Boolean).join(' — ')
      if (!detail) return null
      return `${question.question}\n${detail}`
    })
    .filter((line): line is string => line != null)
    .join('\n\n')
}
