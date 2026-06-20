// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { makeCandidateDeps, profileFixture, session } from '@/server/routers/candidate.test.fixtures'

function caller(deps = makeCandidateDeps()) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

describe('candidateRouter', () => {
  it('returns candidates and pipeline stages for the CVthèque', async () => {
    const deps = makeCandidateDeps()
    const result = await caller(deps).list()
    expect(result.candidates).toEqual([{ id: 'c1' }])
    expect(result.stages).toEqual([{ id: 's1', name: 'Nouveau' }])
  })

  it('keeps cvtheque as alias of list', async () => {
    const deps = makeCandidateDeps()
    expect(await caller(deps).cvtheque()).toEqual(await caller(deps).list())
  })

  it('searches candidates for the picker', async () => {
    const deps = makeCandidateDeps()
    const result = await caller(deps).search({ term: 'cam' })
    expect(deps.search).toHaveBeenCalledWith('cam', undefined)
    expect(result).toEqual([
      {
        id: 'c1',
        label: 'Camille Durand',
        jobTitle: 'Pharmacien',
        city: 'Lyon',
        postalCode: '69003',
      },
    ])
  })

  it('returns profile payload with ADR 0010 incomplete matching flags', async () => {
    const result = await caller().getById({ id: 'c1' })
    expect(result?.isProfileIncompleteForMatching).toBe(true)
    expect(result?.missingMatchingFields).toEqual(
      expect.arrayContaining(['postalCode', 'mobilityRadiusKm']),
    )
  })

  it('updates candidate profile via repository', async () => {
    const deps = makeCandidateDeps()
    await caller(deps).update({
      id: 'c1',
      data: {
        firstName: 'Camille',
        lastName: 'Durand',
        jobTitleId: 'jt1',
        referentId: 'u1',
        mobilityRadiusKm: 30,
        softwareIds: [],
        contractTypes: [],
      },
    })
    expect(deps.updateProfile).toHaveBeenCalledWith(
      'c1',
      expect.objectContaining({ firstName: 'Camille', mobilityRadiusKm: 30 }),
    )
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeCandidateRouter(makeCandidateDeps()))({ session: null })
    await expect(unauth.cvtheque()).rejects.toThrow()
  })
})
