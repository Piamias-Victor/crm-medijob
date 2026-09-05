// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { mockProvider } from '@/server/ai/mock-provider'
import { createFixedGeoLookup } from '@/server/matching/distance'
import { makeMatchingRouter, type MatchingRouterDeps } from '@/server/routers/matching'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

const badakanMission = {
  jobTitleId: 'jt-prep',
  jobTitleName: 'Préparateur',
  pharmacyName: 'Pharmacie du Cygne',
  city: 'Strasbourg',
  postalCode: '67000',
  softwareName: 'LGPI',
  activityLabel: 'Préparateur Expert',
  periods: [{ start: '2026-09-10', end: '2026-09-12' }],
}

const candidate = {
  id: 'c1',
  firstName: 'Margo',
  lastName: 'Rié',
  email: null,
  phone: null,
  city: 'Strasbourg',
  postalCode: '67000',
  mobilityRadiusKm: 30,
  availableFrom: null,
  salaryExpectations: null,
  salaryMin: null,
  salaryMax: null,
  jobTitleId: 'jt-prep',
  jobTitle: { name: 'Préparateur' },
  contractPreferences: [{ contractType: 'INTERIM' as const }],
}

function deps(overrides: Partial<MatchingRouterDeps> = {}): MatchingRouterDeps {
  return {
    findMission: vi.fn().mockResolvedValue(null),
    listCandidates: vi.fn().mockResolvedValue([]),
    listCompatibilities: vi.fn().mockResolvedValue([{ candidateJobTitleId: 'jt-prep', score: 100 }]),
    provider: mockProvider,
    lookupGeo: createFixedGeoLookup({ lat: 48.58, lon: 7.74 }),
    findBadakanMission: vi.fn().mockResolvedValue(badakanMission),
    listDeclaredCandidates: vi.fn().mockResolvedValue([candidate]),
    ...overrides,
  }
}

describe('matching.scoreBadakanMissionCandidates', () => {
  beforeEach(() => {
    process.env.EXTRACTION_PROVIDER = 'mock'
  })

  it('scores declared-availability candidates for a Badakan mission', async () => {
    const result = await createCallerFactory(makeMatchingRouter(deps()))({ session })
      .scoreBadakanMissionCandidates({ missionId: 'm1' })
    expect(result.scored[0]?.candidateId).toBe('c1')
  })

  it('returns NOT_FOUND when the métier is unresolved', async () => {
    const d = deps({
      findBadakanMission: vi.fn().mockResolvedValue({ ...badakanMission, jobTitleId: null }),
    })
    await expect(
      createCallerFactory(makeMatchingRouter(d))({ session }).scoreBadakanMissionCandidates({
        missionId: 'm1',
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })
})
