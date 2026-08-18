import { describe, expect, it } from 'vitest'
import { suggestInterviewDecision } from '@/view-models/interview-scoring-decision'
import type { InterviewScoringQuestion } from '@/view-models/interview-scoring-catalog'

const catalog: InterviewScoringQuestion[] = [
  {
    id: 'q1',
    question: 'Expérience ?',
    eliminatoire: false,
    mainCritere: 'B1',
    suggestedAnswers: [
      { label: 'Faible', points: 0, tone: 'weak' },
      { label: 'Fort', points: 10, tone: 'excellent' },
    ],
  },
  {
    id: 'ordre',
    question: 'Inscrit à l’Ordre ?',
    eliminatoire: true,
    suggestedAnswers: [
      { label: 'Non inscrit', points: 0, tone: 'weak' },
      { label: 'Section A', points: 0, tone: 'excellent' },
    ],
  },
]

describe('suggestInterviewDecision', () => {
  it('suggests ELIGIBLE when the score ratio is high', () => {
    expect(suggestInterviewDecision({ B1: 10 }, catalog, { questions: {}, checklist: {} })).toBe(
      'ELIGIBLE',
    )
  })

  it('suggests REVIEW for a mid score and NON_ELIGIBLE for a low score', () => {
    const empty = { questions: {}, checklist: {} }
    expect(suggestInterviewDecision({ B1: 5 }, catalog, empty)).toBe('REVIEW')
    expect(suggestInterviewDecision({ B1: 0 }, catalog, empty)).toBe('NON_ELIGIBLE')
  })

  it('suggests NON_ELIGIBLE when an eliminatory answer is weak', () => {
    expect(
      suggestInterviewDecision({ B1: 10 }, catalog, {
        questions: { ordre: { choiceLabel: 'Non inscrit' } },
        checklist: {},
      }),
    ).toBe('NON_ELIGIBLE')
  })
})
