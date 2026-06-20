// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { TRPCError } from '@trpc/server'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { session } from '@/server/routers/candidate.test.fixtures'
import {
  makeCvDeps,
  mockExtraction,
  pdfBase64,
} from '@/server/routers/candidate-cv.test.fixtures'

function caller(deps = makeCvDeps()) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

describe('candidateRouter CV extraction', () => {
  it('uploads PDF, runs mock extraction, returns review payload without DB write', async () => {
    const deps = makeCvDeps()
    const result = await caller(deps).extractCv({
      candidateId: 'c1',
      filename: 'cv.pdf',
      mimeType: 'application/pdf',
      size: 8,
      dataBase64: pdfBase64,
    })

    expect(deps.uploadCvBlob).toHaveBeenCalled()
    expect(deps.runCvExtraction).toHaveBeenCalledWith({
      filename: 'cv.pdf',
      mimeType: 'application/pdf',
      dataBase64: pdfBase64,
    })
    expect(deps.confirmCvExtraction).not.toHaveBeenCalled()
    expect(result).toMatchObject({
      cvUrl: 'https://blob.example/cv.pdf',
      extraction: mockExtraction,
      suggestedJobTitles: [{ id: 'jt1', name: 'Pharmacien' }],
    })
  })

  it('rolls back blob when extraction response is invalid', async () => {
    const deps = makeCvDeps({
      runCvExtraction: vi.fn().mockRejectedValue(new Error('AI_RESPONSE_NOT_JSON')),
    })

    await expect(
      caller(deps).extractCv({
        candidateId: 'c1',
        filename: 'cv.pdf',
        mimeType: 'application/pdf',
        size: 8,
        dataBase64: pdfBase64,
      }),
    ).rejects.toBeInstanceOf(TRPCError)

    expect(deps.deleteCvBlob).toHaveBeenCalledWith('https://blob.example/cv.pdf')
  })

  it('confirms reviewed extraction and persists cvUrl + profile fields', async () => {
    const deps = makeCvDeps()
    await caller(deps).confirmExtraction({
      candidateId: 'c1',
      cvUrl: 'https://abc123.public.blob.vercel-storage.com/cv.pdf',
      data: {
        firstName: 'Camille',
        lastName: 'Martin',
        jobTitleId: 'jt1',
        referentId: 'u1',
        mobilityRadiusKm: 30,
        softwareIds: ['sw1'],
        contractTypes: ['CDI'],
      },
    })

    expect(deps.confirmCvExtraction).toHaveBeenCalledWith(
      'c1',
      expect.objectContaining({
        cvUrl: 'https://abc123.public.blob.vercel-storage.com/cv.pdf',
        lastName: 'Martin',
      }),
    )
  })
})
