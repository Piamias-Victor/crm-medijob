import { describe, it, expect } from 'vitest'
import { toCandidateSearchOptions } from '@/server/routers/candidate-search'

describe('toCandidateSearchOptions', () => {
  it('maps searchable candidate fields for the pipeline picker', () => {
    const options = toCandidateSearchOptions([
      {
        id: 'c1',
        firstName: 'Camille',
        lastName: 'Durand',
        city: 'Lyon',
        postalCode: '69003',
        jobTitle: { name: 'Pharmacien' },
      },
    ])

    expect(options).toEqual([
      {
        id: 'c1',
        label: 'Camille Durand',
        jobTitle: 'Pharmacien',
        city: 'Lyon',
        postalCode: '69003',
      },
    ])
  })
})
