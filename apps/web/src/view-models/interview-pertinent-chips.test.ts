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
})
