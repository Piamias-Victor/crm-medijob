import { describe, expect, it } from 'vitest'
import { suggestInterviewScores } from '@/view-models/interview-scoring'
import type { InterviewScoringQuestion } from '@/view-models/interview-scoring-catalog'

const quality: InterviewScoringQuestion['suggestedAnswers'] = [
  { label: 'Réponse floue / évasive', points: 0, tone: 'weak' },
  { label: 'Réponse correcte, générique', points: 4, tone: 'ok' },
  { label: 'Réponse solide, structurée', points: 6, tone: 'good' },
  { label: 'Réponse remarquable, exemples concrets', points: 8, tone: 'excellent' },
]

describe('suggestInterviewScores CDD/CDI chips', () => {
  it('scores career chips against the quality scale', () => {
    const scores = suggestInterviewScores(
      {
        questions: {
          q3: { choiceLabel: 'Titulaire / associé' },
          q4: { choiceLabel: 'Stabilité, Évolution' },
        },
        checklist: {},
      },
      [
        {
          id: 'q3',
          question: 'Où vous voyez-vous professionnellement dans 3 ans ?',
          eliminatoire: false,
          mainCritere: 'B7',
          suggestedAnswers: quality,
        },
        {
          id: 'q4',
          question:
            'Pourquoi cherchez-vous un CDI / CDD plutôt que de l’intérim ou de rester dans votre poste actuel ?',
          eliminatoire: false,
          mainCritere: 'B7',
          suggestedAnswers: quality,
        },
      ],
    )
    expect(scores).toEqual({ B7: 14 })
  })
})
