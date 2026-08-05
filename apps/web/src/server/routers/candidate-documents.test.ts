// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { makeCandidateDeps, session } from '@/server/routers/candidate.test.fixtures'
import { emptyAnonymizedDossier, parseAnonymizedDossier } from '@/view-models/anonymized-dossier'

const documentsProfile = {
  id: 'c1',
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'camille@example.com',
  phone: '0612345678',
  address: '12 rue Test',
  city: 'Lyon',
  postalCode: '69001',
  notes: '5 ans en officine',
  cvSummary: null as string | null,
  anonymizedProfile: null as string | null,
  jobTitle: { name: 'Pharmacien' },
  mobilityRadiusKm: 30,
  mobilityNotes: 'Rhône-Alpes',
  availableFrom: null,
  softwares: [{ software: { name: 'Winpharma' } }],
}

function documentsCaller(overrides: Partial<ReturnType<typeof makeCandidateDeps>> = {}) {
  const updateDerivedFields = vi.fn().mockImplementation(async (_id, fields) => ({
    ...documentsProfile,
    ...fields,
  }))
  const deps = makeCandidateDeps({
    findDocumentsProfile: vi.fn().mockResolvedValue(documentsProfile),
    updateDerivedFields,
    ...overrides,
  })
  return {
    caller: createCallerFactory(makeCandidateRouter(deps))({ session }),
    updateDerivedFields,
  }
}

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

  it('generateAnonymized rejects when cvSummary is missing', async () => {
    const { caller } = documentsCaller()
    await expect(caller.generateAnonymized({ id: 'c1' })).rejects.toMatchObject({
      message: 'Générez d’abord le résumé IA.',
    })
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
