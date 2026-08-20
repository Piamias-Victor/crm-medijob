// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { cddDraft, devisCaller, makeInMemoryDevisDeps } from '@/server/routers/devis.test.fixtures'
import { DOCUMENT_UPLOAD_BLOB_DENIED } from '@/lib/document-upload'

describe('devisRouter.send blob failure', () => {
  it('keeps the DRAFT when blob upload fails', async () => {
    const deps = makeInMemoryDevisDeps()
    deps.uploadBlob = async () => {
      throw new Error('Vercel Blob: Access denied, please provide a valid token for this resource.')
    }
    const caller = devisCaller(deps)
    await caller.save(cddDraft)
    await expect(caller.send({ missionId: 'm1' })).rejects.toThrow(DOCUMENT_UPLOAD_BLOB_DENIED)
    const loaded = await caller.getByMission({ missionId: 'm1' })
    expect(loaded.draft?.status).toBe('DRAFT')
    expect(loaded.current?.status).toBe('DRAFT')
  })
})
