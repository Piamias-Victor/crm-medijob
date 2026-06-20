import { describe, expect, it } from 'vitest'
import { toCandidateQuickCreateData } from './candidate-create-map'

describe('toCandidateQuickCreateData', () => {
  it('maps quick create input with defaults', () => {
    expect(
      toCandidateQuickCreateData({
        firstName: 'Camille',
        lastName: 'Durand',
        jobTitleId: 'jt1',
        referentId: 'u1',
        city: 'Lyon',
      }),
    ).toEqual({
      firstName: 'Camille',
      lastName: 'Durand',
      email: null,
      phone: null,
      city: 'Lyon',
      jobTitleId: 'jt1',
      referentId: 'u1',
      mobilityRadiusKm: 30,
    })
  })
})
