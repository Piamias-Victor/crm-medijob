import { describe, expect, it } from 'vitest'
import { interviewQuestionKind } from '@/view-models/interview-question-kind'

describe('interviewQuestionKind', () => {
  it('uses officinal software list for logiciel questions', () => {
    expect(interviewQuestionKind('Quels logiciels métier maîtrisez-vous ?')).toBe('software')
  })

  it('uses now + date picker for availability questions', () => {
    expect(
      interviewQuestionKind('À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?'),
    ).toBe('availability')
  })
})
