// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { emptyAnonymizedDossier, parseAnonymizedDossier } from '@/view-models/anonymized-dossier'
import {
  documentsCaller,
  documentsProfile,
} from '@/server/routers/candidate-documents.test.fixtures'

describe('candidate documents mutations', () => {
  it('generateSummary persists cvSummary after Zod validation', async () => {
    const { caller, updateDerivedFields } = documentsCaller()
    const result = await caller.generateSummary({ id: 'c1' })
    expect(result.cvSummary.length).toBeGreaterThan(0)
    expect(updateDerivedFields).toHaveBeenCalledWith(
      'c1',
      expect.objectContaining({ cvSummary: expect.any(String) }),
    )
  })

  it('generateAnonymized persists structured JSON without PII', async () => {
    const { caller, updateDerivedFields } = documentsCaller({
      findDocumentsProfile: vi.fn().mockResolvedValue({
        ...documentsProfile,
        cvSummary: 'Pharmacienne expérimentée en officine.',
      }),
    })
    const result = await caller.generateAnonymized({ id: 'c1' })
    const dossier = parseAnonymizedDossier(result.anonymizedProfile)
    expect(dossier?.accroche.length).toBeGreaterThan(0)
    expect(result.anonymizedProfile.toLowerCase()).not.toContain('camille')
    expect(updateDerivedFields).toHaveBeenCalled()
  })

  it('generateAnonymized works without cvSummary', async () => {
    const { caller, updateDerivedFields } = documentsCaller()
    const result = await caller.generateAnonymized({ id: 'c1' })
    expect(parseAnonymizedDossier(result.anonymizedProfile)?.accroche.length).toBeGreaterThan(0)
    expect(updateDerivedFields).toHaveBeenCalled()
  })

  it('saveAnonymized persists edits and refuses PII', async () => {
    const { caller, updateDerivedFields } = documentsCaller()
    const dossier = { ...emptyAnonymizedDossier(), accroche: 'Profil officine' }
    const result = await caller.saveAnonymized({ id: 'c1', dossier })
    expect(parseAnonymizedDossier(result.anonymizedProfile)?.accroche).toBe('Profil officine')
    expect(updateDerivedFields).toHaveBeenCalled()

    await expect(
      caller.saveAnonymized({
        id: 'c1',
        dossier: { ...emptyAnonymizedDossier(), accroche: 'Camille Durand' },
      }),
    ).rejects.toMatchObject({
      message: 'Le dossier anonymisé contient des données personnelles. Réessaie.',
    })
  })

  it('saveCvSummary persists manual edits', async () => {
    const { caller, updateDerivedFields } = documentsCaller()
    const result = await caller.saveCvSummary({
      id: 'c1',
      cvSummary: '## Pharmacien\n\nProfil édité manuellement.',
    })
    expect(result.cvSummary).toContain('Profil édité manuellement')
    expect(updateDerivedFields).toHaveBeenCalledWith('c1', {
      cvSummary: '## Pharmacien\n\nProfil édité manuellement.',
    })
  })
})
