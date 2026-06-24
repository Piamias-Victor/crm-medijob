// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { session } from '@/server/routers/candidate.test.fixtures'
import { makeCvDeps, mockExtraction, pdfBase64 } from '@/server/routers/candidate-cv.test.fixtures'

function caller(deps = makeCvDeps()) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

describe('candidateRouter extractCvDraft', () => {
  it('uploads PDF without existing candidate and returns review payload', async () => {
    const deps = makeCvDeps()
    const result = await caller(deps).extractCvDraft({
      filename: 'cv.pdf',
      mimeType: 'application/pdf',
      size: 8,
      dataBase64: pdfBase64,
    })

    expect(deps.findProfileById).not.toHaveBeenCalled()
    expect(deps.uploadCvBlob).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: expect.stringMatching(/^candidate\/import\/[0-9a-f-]+\/cv\//),
      }),
    )
    expect(result).toMatchObject({
      cvUrl: 'https://blob.example/cv.pdf',
      extraction: mockExtraction,
      suggestedJobTitles: [{ id: 'jt1', name: 'Pharmacien' }],
    })
  })
})
