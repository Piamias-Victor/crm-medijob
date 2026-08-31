import { describe, expect, it, vi } from 'vitest'
import type { BadakanDossier } from '@/server/badakan/fetch-dossier'
import { syncIdentityDossier } from './sync-identity-files'

const dossier: BadakanDossier = {
  nir: '1850178123456',
  iban: 'FR76IBAN',
  resume: {
    body: Buffer.from('cv'),
    contentType: 'image/jpeg',
    filename: 'cv.jpg',
  },
  files: [
    { category: 'CNI', body: Buffer.from('cni'), contentType: 'application/pdf', filename: 'cni-recto.pdf' },
    { category: 'RIB', body: Buffer.from('rib'), contentType: 'application/pdf', filename: 'rib-recto.pdf' },
    { category: 'DIPLOME', body: Buffer.from('dip'), contentType: 'application/pdf', filename: 'diplome-recto.pdf' },
  ],
}

function stubDeps() {
  return {
    uploadBlob: vi.fn(async ({ pathname }: { pathname: string }) => ({
      url: `https://blob.example/${pathname}`,
    })),
    patchIdentity: vi.fn(),
    createDocument: vi.fn(),
  }
}

describe('syncIdentityDossier', () => {
  it('stores CV on cvUrl and CNI RIB diploma as Documents', async () => {
    const deps = stubDeps()
    await syncIdentityDossier('c1', 'bk-1', dossier, { cvUrl: null, categories: [] }, deps)
    expect(deps.patchIdentity).toHaveBeenCalledWith(
      'c1',
      expect.objectContaining({
        cvUrl: 'https://blob.example/candidate/badakan/bk-1/cv.jpg',
        nir: '1850178123456',
        iban: 'FR76IBAN',
      }),
    )
    const categories = deps.createDocument.mock.calls.map((c) => c[0].category).sort()
    expect(categories).toEqual(['CNI', 'DIPLOME', 'RIB'])
    expect(deps.createDocument.mock.calls[0]?.[0]).toMatchObject({
      entityType: 'CANDIDATE',
      candidateId: 'c1',
    })
  })

  it('does not duplicate CV or Documents already on the fiche', async () => {
    const deps = stubDeps()
    await syncIdentityDossier(
      'c1',
      'bk-1',
      dossier,
      { cvUrl: 'https://blob.example/existing-cv.jpg', categories: ['CNI', 'RIB', 'DIPLOME'] },
      deps,
    )
    expect(deps.uploadBlob).not.toHaveBeenCalled()
    expect(deps.createDocument).not.toHaveBeenCalled()
    expect(deps.patchIdentity).toHaveBeenCalledWith(
      'c1',
      expect.objectContaining({ nir: '1850178123456', iban: 'FR76IBAN' }),
    )
    expect(deps.patchIdentity.mock.calls[0]?.[1]).not.toHaveProperty('cvUrl')
  })
})
