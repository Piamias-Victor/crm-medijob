import { describe, expect, it } from 'vitest'
import { candidateMatchingSelect } from './candidate-matching.select'
import type { MatchingCandidateInput } from '@/server/matching/matching-input.types'
import { candidateListFiltersSchema } from '@/view-models/candidate-list-filters.schema'

describe('matching excludes identity numbers', () => {
  it('does not select NIR or IBAN for CDI matching', () => {
    expect(candidateMatchingSelect).not.toHaveProperty('nir')
    expect(candidateMatchingSelect).not.toHaveProperty('iban')
  })

  it('matching input has no NIR or IBAN keys', () => {
    const sample: MatchingCandidateInput = {
      id: 'c1',
      firstName: 'A',
      lastName: 'B',
      jobTitleId: 'jt',
      jobTitleName: 'Pharmacien',
      city: 'Lyon',
      postalCode: '69001',
      mobilityRadiusKm: 30,
      availableFrom: null,
      preferredContractTypes: [],
      salaryExpectations: null,
      salaryMin: null,
      salaryMax: null,
    }
    expect(sample).not.toHaveProperty('nir')
    expect(sample).not.toHaveProperty('iban')
  })

  it('drops NIR and IBAN from availability list filters', () => {
    const parsed = candidateListFiltersSchema.parse({
      available: true,
      nir: '1850178123456',
      iban: 'FR76IBAN',
    })
    expect(parsed.available).toBe(true)
    expect(parsed).not.toHaveProperty('nir')
    expect(parsed).not.toHaveProperty('iban')
  })
})
