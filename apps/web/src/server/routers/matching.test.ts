// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { mockProvider } from '@/server/ai/mock-provider'
import { createFixedGeoLookup } from '@/server/matching/distance'
import { makeMatchingRouter, type MatchingRouterDeps } from '@/server/routers/matching'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

const mission = {
  id: 'm1',
  title: 'Titulaire CDI',
  description: 'Officine centre-ville',
  contractType: 'CDI' as const,
  startDate: new Date('2026-07-01'),
  jobTitleId: 'jt-pharmacien',
  jobTitle: { name: 'Pharmacien' },
  pharmacy: { name: 'Pharmacie du Centre', city: 'Lyon', postalCode: '69001' },
}

const candidateOk = {
  id: 'c-ok',
  firstName: 'Camille',
  lastName: 'Durand',
  city: 'Lyon',
  postalCode: '69003',
  mobilityRadiusKm: 30,
  availableFrom: null,
  jobTitleId: 'jt-pharmacien',
  jobTitle: { name: 'Pharmacien' },
  contractPreferences: [{ contractType: 'CDI' as const }],
}

const candidateKo = {
  ...candidateOk,
  id: 'c-ko',
  jobTitleId: 'jt-preparateur',
  jobTitle: { name: 'Préparateur' },
}

function makeDeps(overrides: Partial<MatchingRouterDeps> = {}): MatchingRouterDeps {
  return {
    findMission: vi.fn().mockResolvedValue(mission),
    listCandidates: vi.fn().mockResolvedValue([candidateOk, candidateKo]),
    listCompatibilities: vi.fn().mockResolvedValue([
      { candidateJobTitleId: 'jt-pharmacien', score: 100 },
      { candidateJobTitleId: 'jt-preparateur', score: 0 },
    ]),
    provider: mockProvider,
    lookupGeo: createFixedGeoLookup({ lat: 45.75, lon: 4.85 }),
    ...overrides,
  }
}

function caller(deps: MatchingRouterDeps) {
  return createCallerFactory(makeMatchingRouter(deps))({ session })
}

describe('matching.scoreMissionCandidates', () => {
  beforeEach(() => {
    process.env.EXTRACTION_PROVIDER = 'mock'
  })

  it('returns scored candidates after deterministic prefilter', async () => {
    const result = await caller(makeDeps()).scoreMissionCandidates({ missionId: 'm1' })
    expect(result.scored).toHaveLength(1)
    expect(result.scored[0]?.candidateId).toBe('c-ok')
    expect(result.excluded).toHaveLength(1)
    expect(result.excluded[0]?.reasons[0]?.code).toBe('job_title')
  })

  it('returns NOT_FOUND when mission is missing', async () => {
    const deps = makeDeps({ findMission: vi.fn().mockResolvedValue(null) })
    await expect(caller(deps).scoreMissionCandidates({ missionId: 'missing' })).rejects.toMatchObject({
      code: 'NOT_FOUND',
    })
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeMatchingRouter(makeDeps()))({ session: null })
    await expect(unauth.scoreMissionCandidates({ missionId: 'm1' })).rejects.toThrow()
  })
})
