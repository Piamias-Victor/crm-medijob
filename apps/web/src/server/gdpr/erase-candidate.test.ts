import { describe, expect, it, vi } from 'vitest'
import { eraseCandidateGdpr, type EraseCandidateGdprDeps } from '@/server/gdpr/erase-candidate'

function makeDeps(overrides: Partial<EraseCandidateGdprDeps> = {}): EraseCandidateGdprDeps {
  return {
    findCandidateForErase: vi.fn().mockResolvedValue({
      id: 'c1',
      cvUrl: 'https://x.blob.vercel-storage.com/cv.pdf',
    }),
    listDocumentUrls: vi.fn().mockResolvedValue(['https://x.blob.vercel-storage.com/cni.pdf']),
    listApplicationCvUrls: vi.fn().mockResolvedValue(['https://x.blob.vercel-storage.com/app.pdf']),
    deleteBlobs: vi.fn().mockResolvedValue(undefined),
    hardDeleteCandidateCascade: vi.fn().mockResolvedValue(undefined),
    createAudit: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

describe('eraseCandidateGdpr', () => {
  it('hard-deletes candidate, blobs, and writes PII-free audit', async () => {
    const deps = makeDeps()
    const result = await eraseCandidateGdpr(deps, {
      candidateId: 'c1',
      erasedByUserId: 'u-dir',
      reason: 'demande RGPD',
    })

    expect(result).toEqual({ id: 'c1' })
    expect(deps.deleteBlobs).toHaveBeenCalledWith(
      expect.arrayContaining([
        'https://x.blob.vercel-storage.com/cv.pdf',
        'https://x.blob.vercel-storage.com/cni.pdf',
        'https://x.blob.vercel-storage.com/app.pdf',
      ]),
    )
    expect(deps.hardDeleteCandidateCascade).toHaveBeenCalledWith('c1')
    expect(deps.createAudit).toHaveBeenCalledWith({
      entityType: 'CANDIDATE',
      entityId: 'c1',
      erasedByUserId: 'u-dir',
      reason: 'demande RGPD',
    })
    const auditArg = vi.mocked(deps.createAudit).mock.calls[0]?.[0]
    expect(JSON.stringify(auditArg)).not.toMatch(/Durand|camille@|06\d/i)
  })

  it('throws NOT_FOUND when candidate missing', async () => {
    const deps = makeDeps({ findCandidateForErase: vi.fn().mockResolvedValue(null) })
    await expect(
      eraseCandidateGdpr(deps, { candidateId: 'missing', erasedByUserId: 'u1' }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
    expect(deps.hardDeleteCandidateCascade).not.toHaveBeenCalled()
  })
})
