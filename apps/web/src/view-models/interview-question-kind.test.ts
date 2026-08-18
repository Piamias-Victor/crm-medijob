import { describe, expect, it } from 'vitest'
import { interviewQuestionKind, selectedChoiceValues } from '@/view-models/interview-question-kind'

describe('interviewQuestionKind', () => {
  it('uses officinal software list for logiciel questions', () => {
    expect(interviewQuestionKind('Quels logiciels métier maîtrisez-vous ?')).toBe('software')
  })

  it('uses now + date picker for availability questions', () => {
    expect(
      interviewQuestionKind('À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?'),
    ).toBe('availability')
  })

  it('marks motivation chips as multi-choice', () => {
    expect(interviewQuestionKind('Qu’est-ce qui vous plaît dans le remplacement / l’intérim ?')).toBe(
      'multi',
    )
  })

  it('keeps 3-year vision exclusive', () => {
    expect(interviewQuestionKind('Où vous voyez-vous professionnellement dans 3 ans ?')).toBe(
      'choice',
    )
  })

  it('keeps exclusive labels with commas intact', () => {
    expect(selectedChoiceValues('Réponse remarquable, exemples concrets', true)).toEqual([
      'Réponse remarquable, exemples concrets',
    ])
  })
})
