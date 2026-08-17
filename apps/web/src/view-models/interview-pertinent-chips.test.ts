import { describe, expect, it } from 'vitest'
import { pertinentInterviewChips } from '@/view-models/interview-pertinent-chips'

describe('pertinentInterviewChips', () => {
  it('offers concrete reasons for liking interim', () => {
    const chips = pertinentInterviewChips('Qu’est-ce qui vous plaît dans le remplacement / l’intérim ?')
    expect(chips?.map((chip) => chip.label)).toContain('Variété d’officines')
    expect(chips?.map((chip) => chip.label)).not.toContain('Flou')
  })

  it('offers mission types a recruiter can tick on a call', () => {
    const chips = pertinentInterviewChips(
      'Quel type de remplacement recherchez-vous (durée, autonomie, type d’officine) ?',
    )
    expect(chips?.map((chip) => chip.label)).toEqual(
      expect.arrayContaining(['1 à 3 jours', 'Autonome (seul)', 'Grosse affluence']),
    )
  })

  it('offers expectation and new-team chips without join-separator commas', () => {
    const prompts = [
      'Quelles sont vos attentes et vos critères prioritaires ?',
      'Comment réagissez-vous lorsque vous intégrez une nouvelle équipe pour une mission courte ?',
    ]
    for (const prompt of prompts) {
      const chips = pertinentInterviewChips(prompt) ?? []
      expect(chips.length).toBeGreaterThan(1)
      expect(chips.map((chip) => chip.label).join('|')).not.toContain(', ')
    }
  })
})
