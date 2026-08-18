import { INTERVIEW_AVAILABLE_NOW } from '@/view-models/interview-copy'
import { pertinentInterviewChips } from '@/view-models/interview-pertinent-chips'
import { splitChoiceLabels } from '@/view-models/interview-question-kind'
import { interviewRunWidgetKind } from '@/view-models/interview-run-widget-kind'
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

function isOpenQualityScale(question: InterviewScoringQuestion): boolean {
  return question.suggestedAnswers.some((answer) => answer.label.startsWith('Réponse floue'))
}

function pointsAtScaleIndex(question: InterviewScoringQuestion, index: number): number {
  const ranked = [...question.suggestedAnswers].map((answer) => answer.points).sort((a, b) => a - b)
  if (ranked.length === 0) return 0
  return ranked[Math.min(Math.max(index, 0), ranked.length - 1)] ?? 0
}

function pointsForOpenChips(
  question: InterviewScoringQuestion,
  choiceLabel: string,
): number | null {
  if (!isOpenQualityScale(question)) return null
  const chips = pertinentInterviewChips(question.question)
  if (!chips) return null
  if (interviewRunWidgetKind(question) === 'choice') {
    const index = chips.findIndex((chip) => chip.label === choiceLabel)
    return index < 0 ? 0 : pointsAtScaleIndex(question, index)
  }
  return pointsAtScaleIndex(question, splitChoiceLabels(choiceLabel).length)
}

export function pointsForChoice(
  question: InterviewScoringQuestion,
  choiceLabel?: string,
): number {
  if (!choiceLabel) return 0
  const exact = question.suggestedAnswers.find((answer) => answer.label === choiceLabel)
  if (exact) return exact.points
  const kind = interviewRunWidgetKind(question)
  if (kind === 'availability' && choiceLabel === INTERVIEW_AVAILABLE_NOW) return maxPoints(question)
  if (kind === 'software') return pointsBySoftwareCount(question, splitChoiceLabels(choiceLabel).length)
  const open = pointsForOpenChips(question, choiceLabel)
  if (open !== null) return open
  return splitChoiceLabels(choiceLabel).reduce((sum, label) => {
    const hit = question.suggestedAnswers.find((answer) => answer.label === label)
    return sum + (hit?.points ?? 0)
  }, 0)
}
