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
  latitude: null,
  longitude: null,
  jobTitleId: 'jt1',
  origin: 'CRM',
  badakanId: null,
  status: 'NOUVEAU',
  statusBeforeInactive: null,
  salaryExpectations: null,
  salaryMin: null,
  salaryMax: null,
  mobilityRadiusKm: 30,
  mobilityNotes: null,
  availableFrom: null,
  notes: null,
  referentId: 'u1',
  cvUrl: null,
  nir: null,
  iban: null,
  cvSummary: null,
  anonymizedProfile: null,
  consentGivenAt: null,
  consentSource: null,
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
    expect(payload.missingMatchingFields).not.toContain('nir')
    expect(payload.missingMatchingFields).not.toContain('iban')
  })

  it('exposes origin App so the fiche can copy the weekly availability link', () => {
    const payload = toCandidateProfilePayload({ ...baseProfile, origin: 'APP' })
    expect(payload.origin).toBe('APP')
  })

  it('exposes NIR and IBAN on the fiche payload', () => {
    const payload = toCandidateProfilePayload({
      ...baseProfile,
      nir: '1850178123456',
      iban: 'FR76IBAN',
    })
    expect(payload.nir).toBe('1850178123456')
    expect(payload.iban).toBe('FR76IBAN')
    expect(payload.missingMatchingFields).not.toContain('nir')
  })
})
