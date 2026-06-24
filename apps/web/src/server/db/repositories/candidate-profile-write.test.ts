import { describe, expect, it } from 'vitest'
import {
  toCandidateProfileUpdateData,
  toCandidateProfileWriteData,
} from '@/server/db/repositories/candidate-profile-write'

const sample = {
  firstName: 'Alice',
  lastName: 'Martin',
  jobTitleId: 'jt1',
  referentId: 'u1',
  mobilityRadiusKm: 20,
  softwareIds: ['sw1'],
  contractTypes: ['CDI' as const],
  notes: 'Notes internes',
}

describe('toCandidateProfileWriteData', () => {
  it('maps scalar fields and nested relations for create', () => {
    expect(toCandidateProfileWriteData(sample)).toEqual({
      firstName: 'Alice',
      lastName: 'Martin',
      email: null,
      phone: null,
      address: null,
      city: null,
      postalCode: null,
      jobTitleId: 'jt1',
      mobilityRadiusKm: 20,
      mobilityNotes: null,
      availableFrom: null,
      notes: 'Notes internes',
      referentId: 'u1',
      softwares: { create: [{ softwareId: 'sw1' }] },
      contractPreferences: { create: [{ contractType: 'CDI' }] },
    })
  })

  it('includes cvUrl on update payload when present', () => {
    expect(toCandidateProfileUpdateData({ ...sample, cvUrl: 'https://cv.example/cv.pdf' }).cvUrl).toBe(
      'https://cv.example/cv.pdf',
    )
  })
})
