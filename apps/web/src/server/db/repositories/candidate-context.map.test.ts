import { describe, it, expect } from 'vitest'
import { mapCandidateForContext } from './candidate-context.map'

describe('mapCandidateForContext', () => {
  it('maps job title, softwares, contracts and salary for assistant chat', () => {
    const mapped = mapCandidateForContext({
      firstName: 'Camille',
      lastName: 'Martin',
      city: 'Lyon',
      availableFrom: null,
      mobilityRadiusKm: 30,
      mobilityNotes: 'Rhône',
      cvSummary: 'Expérience officine',
      notes: null,
      status: 'QUALIFIE',
      salaryExpectations: null,
      salaryMin: 28000,
      salaryMax: 32000,
      jobTitle: { name: 'Préparateur' },
      softwares: [{ software: { name: 'Winpharma' } }],
      contractPreferences: [{ contractType: 'CDI' }],
    })
    expect(mapped.jobTitleName).toBe('Préparateur')
    expect(mapped.softwareNames).toEqual(['Winpharma'])
    expect(mapped.preferredContractTypes).toEqual(['CDI'])
    expect(mapped.salaryExpectations).toContain('28000')
    expect(mapped.status).toBe('QUALIFIE')
  })
})
