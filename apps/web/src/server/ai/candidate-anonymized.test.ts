// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { mockProvider } from './mock-provider'
import { assertAnonymizedProfileSafe } from './candidate-anonymized-pii'
import { runCandidateAnonymized } from './candidate-anonymized'

describe('candidate-anonymized', () => {
  it('returns PII-free profile from mock provider', async () => {
    const profile = await runCandidateAnonymized(mockProvider, {
      cvSummary: 'Pharmacienne expérimentée',
      jobTitleName: 'Pharmacien',
      softwareNames: ['Winpharma'],
      mobilityRadiusKm: 30,
      mobilityNotes: 'Rhône-Alpes',
      availableFrom: null,
      forbiddenTokens: ['Camille', 'Durand', 'camille@example.com'],
    })
    expect(profile).toContain('Profil anonymisé')
    expect(profile.toLowerCase()).not.toContain('camille')
  })

  it('rejects profile containing candidate name', () => {
    expect(() =>
      assertAnonymizedProfileSafe({
        profile: 'Candidat Camille Durand expérimentée',
        forbiddenTokens: ['Camille Durand'],
      }),
    ).toThrow('ANONYMIZED_CONTAINS_PII')
  })

  it('rejects profile containing email pattern', () => {
    expect(() =>
      assertAnonymizedProfileSafe({
        profile: 'Contact : test@example.com',
        forbiddenTokens: [],
      }),
    ).toThrow('ANONYMIZED_CONTAINS_PII')
  })
})
