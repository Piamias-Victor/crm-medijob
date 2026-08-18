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
      'Où vous voyez-vous professionnellement dans 3 ans ?',
      'Pourquoi cherchez-vous un CDI / CDD plutôt que de l’intérim ou de rester dans votre poste actuel ?',
    ]
    for (const prompt of prompts) {
      const chips = pertinentInterviewChips(prompt) ?? []
      expect(chips.length).toBeGreaterThan(1)
      expect(chips.map((chip) => chip.label).join('|')).not.toContain(', ')
    }
  })

  it.each([
    ['Où vous voyez-vous professionnellement dans 3 ans ?', 'Titulaire / associé'],
    [
      'Pourquoi cherchez-vous un CDI / CDD plutôt que de l’intérim ou de rester dans votre poste actuel ?',
      'Stabilité',
    ],
    ['Que savez-vous de Medijob et de notre approche du recrutement en pharmacie ?', 'Intérim pharma'],
    ['À quoi ressemble votre officine / environnement de travail idéal ?', 'Équipe soudée'],
    [
      'Quelles sont vos attentes salariales détaillées (fixe, variable, coefficient CCN, avantages) ?',
      'Coeff CCN',
    ],
  ])('offers short CDD/CDI chips for %s', (prompt, chip) => {
    expect(pertinentInterviewChips(prompt)?.map((entry) => entry.label)).toContain(chip)
  })
})
