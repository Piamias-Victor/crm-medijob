import { describe, it, expect } from 'vitest'
import { toCandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import type { CandidateProfileRecord } from '@/server/db/repositories/candidate-profile.repository'

const baseProfile = {
  id: 'c1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  deletedAt: null,
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'camille@example.com',
  phone: null,
  address: null,
  city: null,
  postalCode: '69001',
  jobTitleId: 'jt1',
  mobilityRadiusKm: 30,
  mobilityNotes: null,
  availableFrom: null,
  notes: null,
  referentId: 'u1',
  cvUrl: null,
  cvSummary: null,
  anonymizedProfile: null,
  jobTitle: { id: 'jt1', name: 'Pharmacien' },
  referent: { id: 'u1', name: 'Bob Réf' },
  softwares: [],
  contractPreferences: [],
  missions: [],
} satisfies CandidateProfileRecord

describe('toCandidateProfilePayload', () => {
  it('expose missingMatchingFields quand city absente', () => {
    const payload = toCandidateProfilePayload(baseProfile)
    expect(payload.missingMatchingFields).toEqual(['city'])
    expect(payload.isProfileIncompleteForMatching).toBe(true)
  })
})
