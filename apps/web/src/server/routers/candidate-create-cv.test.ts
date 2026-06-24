// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { makeCandidateDeps, session } from '@/server/routers/candidate.test.fixtures'

function caller(deps = makeCandidateDeps()) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

describe('candidateRouter create from CV', () => {
  it('creates candidate profile with cvUrl when importing from CV', async () => {
    const deps = makeCandidateDeps()
    const cvUrl = 'https://abc123.public.blob.vercel-storage.com/candidate/import/cv.pdf'
    await caller(deps).create({
      firstName: 'Alice',
      lastName: 'Martin',
      jobTitleId: 'jt1',
      referentId: 'u1',
      mobilityRadiusKm: 20,
      softwareIds: [],
      contractTypes: ['CDI'],
      cvUrl,
    })
    expect(deps.createProfile).toHaveBeenCalledWith(expect.objectContaining({ cvUrl }))
  })
})
