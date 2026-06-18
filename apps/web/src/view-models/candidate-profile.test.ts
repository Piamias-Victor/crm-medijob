import { describe, it, expect } from 'vitest'
import {
  getMissingMatchingFields,
  isProfileIncompleteForMatching,
  toCandidateFormValues,
} from '@/view-models/candidate-profile'

describe('isProfileIncompleteForMatching', () => {
  it('flags missing city and postalCode for geo matching', () => {
    expect(
      isProfileIncompleteForMatching({ city: null, postalCode: null, mobilityRadiusKm: 30 }),
    ).toBe(true)
    expect(getMissingMatchingFields({ city: null, postalCode: '69001', mobilityRadiusKm: 30 })).toEqual([
      'city',
    ])
  })

  it('is complete when city and postalCode are set', () => {
    expect(
      isProfileIncompleteForMatching({ city: 'Lyon', postalCode: '69001', mobilityRadiusKm: null }),
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
