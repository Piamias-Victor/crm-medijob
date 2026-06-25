// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { session } from '@/server/routers/candidate.test.fixtures'
import { makeCvDeps } from '@/server/routers/candidate-cv.test.fixtures'

const cvUrl = 'https://abc123.public.blob.vercel-storage.com/candidate/import/cv.pdf'

function caller(deps = makeCvDeps()) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

describe('candidateRouter discardCvDraft', () => {
  it('deletes the uploaded blob when import is abandoned', async () => {
    const deps = makeCvDeps()
    await caller(deps).discardCvDraft({ cvUrl })
    expect(deps.deleteCvBlob).toHaveBeenCalledWith(cvUrl)
  })
})
