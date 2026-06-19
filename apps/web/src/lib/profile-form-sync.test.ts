import { describe, it, expect } from 'vitest'
import { buildProfileFormSnapshot } from '@/lib/profile-form-sync'

describe('buildProfileFormSnapshot', () => {
  it('changes when server profile values change', () => {
    const before = buildProfileFormSnapshot({
      firstName: 'Camille',
      lastName: 'Durand',
      jobTitleId: 'jt1',
      referentId: 'u1',
      mobilityRadiusKm: 30,
      softwareIds: [],
      contractTypes: [],
    })
    const after = buildProfileFormSnapshot({
      firstName: 'Camille',
      lastName: 'Martin',
      jobTitleId: 'jt1',
      referentId: 'u1',
      mobilityRadiusKm: 30,
      softwareIds: [],
      contractTypes: [],
    })

    expect(before).not.toBe(after)
  })
})
