// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { toCandidateQuickView } from '@/view-models/candidate-quick-view'

describe('toCandidateQuickView', () => {
  it('dérive En mission et mappe prétentions', () => {
    const view = toCandidateQuickView({
      id: 'c1',
      firstName: 'Camille',
      lastName: 'Durand',
      email: 'c@example.com',
      phone: null,
      city: 'Lyon',
      postalCode: '69003',
      status: 'QUALIFIE',
      salaryExpectations: '45k',
      salaryMin: 40000,
      salaryMax: 50000,
      mobilityRadiusKm: 30,
      availableFrom: null,
      jobTitle: { name: 'Pharmacien' },
      referent: { name: 'Alice' },
      missions: [
        {
          mission: { id: 'm1', title: 'Titulaire CDI', status: 'EN_RECHERCHE' },
          stage: { name: 'Contacté' },
        },
      ],
    })
    expect(view.effectiveStatus).toBe('EN_MISSION')
    expect(view.salaryExpectations).toBe('45k')
    expect(view.activeMissions).toHaveLength(1)
  })

  it('Blacklisté reste malgré mission', () => {
    const view = toCandidateQuickView({
      id: 'c1',
      firstName: 'Camille',
      lastName: 'Durand',
      email: null,
      phone: null,
      city: null,
      postalCode: null,
      status: 'BLACKLISTE',
      salaryExpectations: null,
      salaryMin: null,
      salaryMax: null,
      mobilityRadiusKm: null,
      availableFrom: null,
      jobTitle: { name: 'Pharmacien' },
      referent: null,
      missions: [
        {
          mission: { id: 'm1', title: 'Titulaire', status: 'EN_RECHERCHE' },
          stage: { name: 'Nouveau' },
        },
      ],
    })
    expect(view.effectiveStatus).toBe('BLACKLISTE')
  })
})
