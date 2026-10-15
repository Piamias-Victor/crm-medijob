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

const extractInput = {
  candidateId: 'c1',
  filename: 'cv.pdf',
  mimeType: 'application/pdf',
  size: 8,
  dataBase64: pdfBase64,
}

describe('candidateRouter CV extraction retry', () => {
  it('rolls back blob when extraction fails twice', async () => {
    const deps = makeCvDeps({
      runCvExtraction: vi.fn().mockRejectedValue(new Error('AI_RESPONSE_NOT_JSON')),
    })

    await expect(caller(deps).extractCv(extractInput)).rejects.toBeInstanceOf(TRPCError)

    expect(deps.runCvExtraction).toHaveBeenCalledTimes(2)
    expect(deps.deleteCvBlob).toHaveBeenCalledWith('https://blob.example/cv.pdf')
  })

  it('retries extraction once after a transient failure', async () => {
    const deps = makeCvDeps({
      runCvExtraction: vi
        .fn()
        .mockRejectedValueOnce(new Error('OPENROUTER_REQUEST_FAILED'))
        .mockResolvedValueOnce(mockExtraction),
    })

    const result = await caller(deps).extractCv(extractInput)

    expect(deps.runCvExtraction).toHaveBeenCalledTimes(2)
    expect(deps.deleteCvBlob).not.toHaveBeenCalled()
    expect(result.extraction).toEqual(mockExtraction)
  })
})
