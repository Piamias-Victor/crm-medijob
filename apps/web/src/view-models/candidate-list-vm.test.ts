// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  candidateDepartment,
  formatCandidateAvailability,
  toCandidateTableRows,
} from '@/view-models/candidate-list-vm'

describe('candidate-list-vm', () => {
  it('formate disponibilité immédiate, à date et sans date', () => {
    const now = new Date('2026-06-24T12:00:00.000Z')
    expect(formatCandidateAvailability(null, now)).toBe('Dès que possible')
    expect(formatCandidateAvailability(new Date('2026-06-20'), now)).toBe('Immédiate')
    expect(formatCandidateAvailability(new Date('2026-07-01'), now)).toBe('01/07/2026')
  })

  it('extrait département depuis postalCode', () => {
    expect(candidateDepartment('69003')).toBe('69')
    expect(candidateDepartment(null)).toBeNull()
  })

  it('mappe lignes tableau', () => {
    const rows = toCandidateTableRows([
      {
        id: 'c1',
        firstName: 'Camille',
        lastName: 'Durand',
        city: 'Lyon',
        postalCode: '69003',
        availableFrom: null,
        jobTitle: { name: 'Pharmacien' },
        referent: { name: 'Recruteur' },
        missions: [],
      },
    ])
    expect(rows[0]).toEqual({
      id: 'c1',
      firstName: 'Camille',
      lastName: 'Durand',
      jobTitle: 'Pharmacien',
      city: 'Lyon',
      department: '69',
      referent: 'Recruteur',
      availability: 'Dès que possible',
    })
  })
})
