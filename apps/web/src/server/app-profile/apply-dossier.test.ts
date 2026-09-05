import { describe, expect, it, vi } from 'vitest'
import { applyBadakanDossier } from './apply-dossier'

describe('applyBadakanDossier', () => {
  it('skips blob writes when GET recipient has no dossier', async () => {
    const uploadBlob = vi.fn()
    await applyBadakanDossier('c1', 'bk-1', {
      fetchDossier: async () => null,
      findState: async () => ({ cvUrl: null, categories: [] }),
      uploadBlob,
      patchIdentity: vi.fn(),
      createDocument: vi.fn(),
    })
    expect(uploadBlob).not.toHaveBeenCalled()
  })
})
