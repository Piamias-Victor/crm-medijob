// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { makeCandidateDeps, directionSession, session } from '@/server/routers/candidate.test.fixtures'
import type { EraseCandidateGdprDeps } from '@/server/gdpr/erase-candidate'

function eraseDeps(overrides: Partial<EraseCandidateGdprDeps> = {}): EraseCandidateGdprDeps {
  return {
    findCandidateForErase: vi.fn().mockResolvedValue({ id: 'c1', cvUrl: null }),
    listDocumentUrls: vi.fn().mockResolvedValue([]),
    listApplicationCvUrls: vi.fn().mockResolvedValue([]),
    deleteBlobs: vi.fn().mockResolvedValue(undefined),
    hardDeleteCandidateCascade: vi.fn().mockResolvedValue(undefined),
    createAudit: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

describe('candidate.gdprErase', () => {
  it('allows Direction to hard-erase a candidate', async () => {
    const gdprErase = eraseDeps()
    const caller = createCallerFactory(
      makeCandidateRouter(makeCandidateDeps({ gdprErase })),
    )({ session: directionSession })
    await expect(caller.gdprErase({ id: 'c1', reason: 'oubli' })).resolves.toEqual({ id: 'c1' })
    expect(gdprErase.hardDeleteCandidateCascade).toHaveBeenCalledWith('c1')
  })

  it('forbids Recruteur from GDPR erase', async () => {
    const caller = createCallerFactory(
      makeCandidateRouter(makeCandidateDeps({ gdprErase: eraseDeps() })),
    )({ session })
    await expect(caller.gdprErase({ id: 'c1' })).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })
})
