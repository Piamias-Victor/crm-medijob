import { describe, it, expect } from 'vitest'
import {
  getMissingMatchingFields,
  isProfileIncompleteForMatching,
  toCandidateFormValues,
} from '@/view-models/candidate-profile'

describe('isProfileIncompleteForMatching', () => {
  it('flags ADR 0010 matching-critical fields', () => {
    expect(
      isProfileIncompleteForMatching({
        city: null,
        postalCode: null,
        mobilityRadiusKm: null,
        availableFrom: null,
      }),
    ).toBe(true)
    expect(
      getMissingMatchingFields({
        city: null,
        postalCode: '69001',
        mobilityRadiusKm: 30,
        availableFrom: new Date(),
      }),
    ).toEqual(['city'])
  })

  it('is complete when all ADR 0010 fields are set', () => {
    expect(
      isProfileIncompleteForMatching({
        city: 'Lyon',
        postalCode: '69001',
        mobilityRadiusKm: 30,
        availableFrom: new Date('2026-06-01'),
      }),
    ).toBe(false)
  })
})

describe('toCandidateFormValues', () => {
  it('maps DB candidate to form defaults with mobility default 30', () => {
    const values = toCandidateFormValues({
      firstName: 'Camille',
      lastName: 'Durand',
      email: 'camille@example.com',
      phone: null,
      address: null,
      city: 'Lyon',
      postalCode: null,
      jobTitleId: 'jt1',
      mobilityRadiusKm: null,
      mobilityNotes: null,
      availableFrom: null,
      notes: null,
      referentId: 'u1',
      softwareIds: ['s1'],
      contractTypes: ['CDI'],
    })
    expect(values.mobilityRadiusKm).toBe(30)
    expect(values.softwareIds).toEqual(['s1'])
    expect(values.contractTypes).toEqual(['CDI'])
  })
})
