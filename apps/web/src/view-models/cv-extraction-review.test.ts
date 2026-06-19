import { describe, it, expect } from 'vitest'
import { buildCvReviewFormValues } from '@/view-models/cv-extraction-review'

const profile = {
  firstName: 'Jean',
  lastName: 'Dupont',
  email: null,
  phone: null,
  address: null,
  city: 'Toulon',
  postalCode: '83200',
  jobTitleId: 'jt2',
  mobilityRadiusKm: 45,
  mobilityNotes: null,
  availableFrom: null,
  notes: null,
  referentId: 'u1',
  softwareIds: [],
  contractTypes: [],
}

describe('buildCvReviewFormValues', () => {
  it('ignores AI placeholder values like N/A and keeps existing profile data', () => {
    const values = buildCvReviewFormValues(
      {
        firstName: 'N/A',
        lastName: 'N/A',
        jobTitle: 'N/A',
        city: 'N/A',
      },
      profile,
      { jobTitles: [{ id: 'jt1', name: 'Pharmacien' }], softwares: [] },
    )

    expect(values.firstName).toBe('Jean')
    expect(values.lastName).toBe('Dupont')
    expect(values.city).toBe('Toulon')
    expect(values.postalCode).toBe('83200')
    expect(values.jobTitleId).toBe('jt2')
  })

  it('maps enriched postalCode and address into the review form', () => {
    const values = buildCvReviewFormValues(
      {
        firstName: 'Alice',
        lastName: 'Martin',
        postalCode: '69001',
        address: '10 rue Nationale',
        city: 'Lyon',
      },
      profile,
      { jobTitles: [], softwares: [] },
    )

    expect(values.postalCode).toBe('69001')
    expect(values.address).toBe('10 rue Nationale')
    expect(values.city).toBe('Lyon')
  })

  it('prefills notes internes with the AI profile summary', () => {
    const values = buildCvReviewFormValues(
      {
        firstName: 'Alice',
        lastName: 'Martin',
        profileSummary: 'Préparatrice expérimentée en officine de ville, à l’aise sur Winpharma.',
      },
      profile,
      { jobTitles: [], softwares: [] },
    )

    expect(values.notes).toContain('Préparatrice expérimentée')
  })
})
