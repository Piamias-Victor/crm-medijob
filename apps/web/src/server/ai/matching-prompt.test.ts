// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { buildMatchingPrompt } from '@/server/ai/matching-prompt'
import type { MatchingCandidateInput } from '@/server/matching/matching-input.types'

const mission = {
  title: 'Titulaire CDI',
  jobTitleName: 'Pharmacien',
  pharmacyName: 'Pharmacie Centrale',
  pharmacyCity: 'Lyon',
  contractType: 'CDI' as const,
  startDate: new Date('2026-07-01'),
  description: null,
}

const candidate: MatchingCandidateInput = {
  id: 'c1',
  firstName: 'Camille',
  lastName: 'Durand',
  jobTitleId: 'jt1',
  jobTitleName: 'Pharmacien',
  city: 'Lyon',
  postalCode: '69003',
  mobilityRadiusKm: 30,
  availableFrom: null,
  preferredContractTypes: ['CDI'],
  salaryExpectations: null,
  salaryMin: null,
  salaryMax: null,
}

describe('buildMatchingPrompt', () => {
  it('demande un objet JSON avec clé scores', () => {
    const prompt = buildMatchingPrompt(mission, [candidate])
    expect(prompt).toContain('"scores"')
    expect(prompt).toContain('candidateId')
  })

  it('inclut les prétentions salariales du candidat quand renseignées', () => {
    const prompt = buildMatchingPrompt(mission, [
      {
        ...candidate,
        salaryExpectations: '45k brut',
        salaryMin: 40000,
        salaryMax: 50000,
      },
    ])
    expect(prompt).toContain('Prétentions: 45k brut')
    expect(prompt).toContain('40000')
    expect(prompt).toContain('50000')
  })
})
