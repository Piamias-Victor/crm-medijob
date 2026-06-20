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
}

describe('buildMatchingPrompt', () => {
  it('demande un objet JSON avec clé scores', () => {
    const prompt = buildMatchingPrompt(mission, [candidate])
    expect(prompt).toContain('"scores"')
    expect(prompt).toContain('candidateId')
  })
})
