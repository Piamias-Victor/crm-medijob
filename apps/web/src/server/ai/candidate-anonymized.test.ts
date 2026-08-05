// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { emptyAnonymizedDossier } from '@/view-models/anonymized-dossier'
import { mockProvider } from './mock-provider'
import { assertAnonymizedDossierSafe } from './candidate-anonymized-pii-dossier'
import { runCandidateAnonymized } from './candidate-anonymized'

describe('candidate-anonymized', () => {
  it('returns PII-free structured dossier from mock provider', async () => {
    const dossier = await runCandidateAnonymized(mockProvider, {
      cvSummary: 'Pharmacienne expérimentée',
      jobTitleName: 'Pharmacien',
      softwareNames: ['Winpharma'],
      mobilityRadiusKm: 30,
      mobilityNotes: 'Rhône-Alpes',
      availableFrom: null,
      forbiddenTokens: ['Camille', 'Durand', 'camille@example.com'],
    })
    expect(dossier.accroche.length).toBeGreaterThan(0)
    expect(JSON.stringify(dossier).toLowerCase()).not.toContain('camille')
  })

  it('rejects dossier section containing candidate name', () => {
    expect(() =>
      assertAnonymizedDossierSafe(
        { ...emptyAnonymizedDossier(), accroche: 'Candidat Camille Durand expérimentée' },
        ['Camille Durand'],
      ),
    ).toThrow('ANONYMIZED_CONTAINS_PII')
  })

  it('rejects dossier containing email pattern', () => {
    expect(() =>
      assertAnonymizedDossierSafe(
        { ...emptyAnonymizedDossier(), pointsForts: 'Contact : test@example.com' },
        [],
      ),
    ).toThrow('ANONYMIZED_CONTAINS_PII')
  })
})
