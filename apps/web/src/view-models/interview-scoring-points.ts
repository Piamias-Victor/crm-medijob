import { INTERVIEW_AVAILABLE_NOW } from '@/view-models/interview-copy'
import {
  interviewQuestionKind,
  splitChoiceLabels,
} from '@/view-models/interview-question-kind'
import type { InterviewScoringQuestion } from '@/view-models/interview-scoring-catalog'

function pointsBySoftwareCount(question: InterviewScoringQuestion, count: number): number {
  const answers = question.suggestedAnswers
  if (count === 0) return answers.find((answer) => answer.label.toLowerCase().includes('aucun'))?.points ?? 0
  if (count >= 3) return answers.find((answer) => answer.label.includes('3'))?.points ?? 0
  if (count === 2) return answers.find((answer) => answer.label.includes('2'))?.points ?? 0
  return answers.find((answer) => answer.label.includes('1'))?.points ?? 0
}

function maxPoints(question: InterviewScoringQuestion): number {
  return Math.max(0, ...question.suggestedAnswers.map((answer) => answer.points))
}

export function pointsForChoice(
  question: InterviewScoringQuestion,
  choiceLabel?: string,
): number {
  if (!choiceLabel) return 0
  const exact = question.suggestedAnswers.find((answer) => answer.label === choiceLabel)
  if (exact) return exact.points
  const kind = interviewQuestionKind(question.question)
  if (kind === 'availability' && choiceLabel === INTERVIEW_AVAILABLE_NOW) return maxPoints(question)
  if (kind === 'software') return pointsBySoftwareCount(question, splitChoiceLabels(choiceLabel).length)
  return splitChoiceLabels(choiceLabel).reduce((sum, label) => {
    const hit = question.suggestedAnswers.find((answer) => answer.label === label)
    return sum + (hit?.points ?? 0)
  }, 0)
}
