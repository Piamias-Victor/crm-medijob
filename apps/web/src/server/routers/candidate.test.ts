// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { makeCandidateDeps, session } from '@/server/routers/candidate.test.fixtures'

function caller(deps = makeCandidateDeps()) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

describe('candidateRouter', () => {
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

  it('creates candidate profile via repository with full payload', async () => {
    const deps = makeCandidateDeps()
    const result = await caller(deps).create({
      firstName: 'Alice',
      lastName: 'Martin',
      jobTitleId: 'jt1',
      referentId: 'u1',
      mobilityRadiusKm: 20,
      softwareIds: ['sw1'],
      contractTypes: ['CDI'],
      notes: 'Contexte recruteur',
    })
    expect(deps.createProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Alice',
        lastName: 'Martin',
        mobilityRadiusKm: 20,
        softwareIds: ['sw1'],
        contractTypes: ['CDI'],
        notes: 'Contexte recruteur',
      }),
    )
    expect(result).toEqual({ id: 'c-new' })
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeCandidateRouter(makeCandidateDeps()))({ session: null })
    await expect(unauth.list()).rejects.toThrow()
  })
})
