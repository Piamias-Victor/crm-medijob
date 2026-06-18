// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter, type CandidateDeps } from '@/server/routers/candidate'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

const profileFixture = {
  id: 'c1',
  firstName: 'Camille',
  lastName: 'Durand',
  email: null,
  phone: null,
  address: null,
  city: 'Lyon',
  postalCode: null,
  jobTitleId: 'jt1',
  mobilityRadiusKm: null,
  mobilityNotes: null,
  availableFrom: null,
  notes: null,
  referentId: 'u1',
  jobTitle: { id: 'jt1', name: 'Pharmacien' },
  referent: { id: 'u1', name: 'Recruteur' },
  softwares: [],
  contractPreferences: [],
  missions: [],
}

function makeDeps(overrides: Partial<CandidateDeps> = {}): CandidateDeps {
  return {
    listForKanban: vi.fn().mockResolvedValue([{ id: 'c1' }]),
    listStages: vi.fn().mockResolvedValue([{ id: 's1', name: 'Nouveau' }]),
    findProfileById: vi.fn().mockResolvedValue(profileFixture),
    updateProfile: vi.fn().mockResolvedValue(profileFixture),
    referentials: vi.fn().mockResolvedValue({
      jobTitles: [{ id: 'jt1', name: 'Pharmacien' }],
      softwares: [],
      recruiters: [{ id: 'u1', name: 'Recruteur' }],
      pipelineStages: [{ id: 's1', name: 'Nouveau', position: 0 }],
    }),
    ...overrides,
  }
}

function caller(deps: CandidateDeps) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

describe('candidateRouter', () => {
  it('returns candidates and pipeline stages for the CVthèque', async () => {
    const deps = makeDeps()
    const result = await caller(deps).cvtheque()
    expect(result.candidates).toEqual([{ id: 'c1' }])
    expect(result.stages).toEqual([{ id: 's1', name: 'Nouveau' }])
  })

  it('returns profile payload with ADR 0010 incomplete matching flags', async () => {
    const result = await caller(makeDeps()).getById({ id: 'c1' })
    expect(result?.isProfileIncompleteForMatching).toBe(true)
    expect(result?.missingMatchingFields).toEqual(
      expect.arrayContaining(['postalCode', 'mobilityRadiusKm']),
    )
  })

  it('updates candidate profile via repository', async () => {
    const deps = makeDeps()
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
    const unauth = createCallerFactory(makeCandidateRouter(makeDeps()))({ session: null })
    await expect(unauth.cvtheque()).rejects.toThrow()
  })
})
