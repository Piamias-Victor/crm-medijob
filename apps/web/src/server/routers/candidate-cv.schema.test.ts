// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { confirmCvExtractionSchema } from '@/server/routers/candidate-cv.schema'

const validBlobUrl = 'https://abc123.public.blob.vercel-storage.com/candidate/c1/cv.pdf'

const base = {
  candidateId: 'c1',
  cvUrl: validBlobUrl,
  data: {
    firstName: 'Camille',
    lastName: 'Martin',
    jobTitleId: 'jt1',
    referentId: 'u1',
    mobilityRadiusKm: 30,
    softwareIds: ['sw1'],
    contractTypes: ['CDI' as const],
  },
}

describe('confirmCvExtractionSchema', () => {
  it('accepte cvUrl sur domaine blob Vercel', () => {
    expect(confirmCvExtractionSchema.safeParse(base).success).toBe(true)
  })

  it('rejette cvUrl hors domaine blob autorisé', () => {
    const result = confirmCvExtractionSchema.safeParse({
      ...base,
      cvUrl: 'https://evil.example.com/cv.pdf',
    })
    expect(result.success).toBe(false)
  })
})
