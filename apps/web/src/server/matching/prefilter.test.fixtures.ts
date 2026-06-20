import type { MatchingCandidateInput, MatchingMissionInput } from '@/server/matching/matching-input.types'

export const mission: MatchingMissionInput = {
  jobTitleId: 'jt-pharmacien',
  contractType: 'CDI',
  startDate: new Date('2026-07-01'),
  pharmacyCity: 'Lyon',
  pharmacyPostalCode: '69001',
}

export const baseCandidate = (
  overrides: Partial<MatchingCandidateInput> = {},
): MatchingCandidateInput => ({
  id: 'c1',
  firstName: 'Camille',
  lastName: 'Durand',
  jobTitleId: 'jt-pharmacien',
  jobTitleName: 'Pharmacien',
  city: 'Lyon',
  postalCode: '69003',
  mobilityRadiusKm: 30,
  availableFrom: null,
  preferredContractTypes: ['CDI'],
  ...overrides,
})

export const nearLookup = async () => ({ lat: 45.75, lon: 4.85 })

export const scores = new Map([['jt-pharmacien', 100], ['jt-preparateur', 100]])
