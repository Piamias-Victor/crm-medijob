import { describe, expect, it } from 'vitest'
import { suggestInterviewScores } from '@/view-models/interview-scoring'
import type { InterviewScoringQuestion } from '@/view-models/interview-scoring-catalog'

const b1: InterviewScoringQuestion = {
  id: 'q1',
  question: 'Expérience ?',
  eliminatoire: false,
  mainCritere: 'B1',
  suggestedAnswers: [
    { label: 'Faible', points: 4, tone: 'weak' },
    { label: 'Fort', points: 12, tone: 'excellent' },
  ],
}

describe('suggestInterviewScores', () => {
  it('sums selected answer points by criterion', () => {
    const scores = suggestInterviewScores(
      { questions: { q1: { choiceLabel: 'Fort' }, q2: { choiceLabel: '1 an' } }, checklist: {} },
      [
        b1,
        {
          id: 'q2',
          question: 'Ancienneté ?',
          eliminatoire: false,
          mainCritere: 'B1',
          suggestedAnswers: [{ label: '1 an', points: 8, tone: 'good' }],
        },
      ],
    )
    expect(scores).toEqual({ B1: 20 })
  })

  it('scores software answers by selected count', () => {
    const scores = suggestInterviewScores(
      { questions: { q9: { choiceLabel: 'Winpharma, LGPI' } }, checklist: {} },
      [
        {
          id: 'q9',
          question: 'Quels logiciels métier maîtrisez-vous ?',
          eliminatoire: false,
          mainCritere: 'B3',
          suggestedAnswers: [
            { label: 'Aucun', points: 0, tone: 'weak' },
            { label: '1 logiciel', points: 4, tone: 'ok' },
            { label: '2 logiciels', points: 7, tone: 'good' },
            { label: '3+ logiciels', points: 10, tone: 'excellent' },
          ],
        },
      ],
    )
    expect(scores).toEqual({ B3: 7 })
  })

  it('scores Maintenant availability as the criterion max', () => {
    const scores = suggestInterviewScores(
      { questions: { q10: { choiceLabel: 'Maintenant' } }, checklist: {} },
      [
        {
          id: 'q10',
          question: 'À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?',
          eliminatoire: false,
          mainCritere: 'B4',
          suggestedAnswers: [
            { label: 'Flou', points: 0, tone: 'weak' },
            { label: 'Immédiate + large', points: 8, tone: 'excellent' },
          ],
        },
      ],
    )
    expect(scores).toEqual({ B4: 8 })
  })
})
