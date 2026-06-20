// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { makeCandidateDeps, session } from '@/server/routers/candidate.test.fixtures'

function caller(deps = makeCandidateDeps()) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

describe('candidateRouter', () => {
  it('list retourne rows + stages sans dupliquer candidates bruts', async () => {
    const result = await caller().list()
    expect(result).not.toHaveProperty('candidates')
    expect(result.rows[0]).toHaveProperty('missions')
    expect(result.stages).toEqual([{ id: 's1', name: 'Nouveau' }])
  })

  it('returns typed list source rows for the CVthèque', async () => {
    const deps = makeCandidateDeps()
    const result = await caller(deps).list()
    expect(result.rows).toHaveLength(1)
    expect(result.stages).toEqual([{ id: 's1', name: 'Nouveau' }])
    expect(result.rows[0]).toMatchObject({ id: 'c1', firstName: 'Camille', city: 'Lyon' })
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
    await expect(unauth.list()).rejects.toThrow()
  })
})
