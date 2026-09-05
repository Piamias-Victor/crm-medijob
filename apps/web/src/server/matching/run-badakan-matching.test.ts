// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { runBadakanMissionMatching } from './run-badakan-matching'
import type { CandidateMatchingRow } from '@/server/db/repositories/candidate-matching.select'

const candidate: CandidateMatchingRow = {
  id: 'c1',
  firstName: 'Margo',
  lastName: 'Rié',
  email: 'margo@ex.com',
  phone: '0600000000',
  city: 'Strasbourg',
  postalCode: '67000',
  mobilityRadiusKm: 30,
  availableFrom: null,
  salaryExpectations: null,
  salaryMin: null,
  salaryMax: null,
  jobTitleId: 'jt-prep',
  jobTitle: { name: 'Préparateur' },
  contractPreferences: [{ contractType: 'INTERIM' }],
}

const mission = {
  id: 'm1',
  jobTitleId: 'jt-prep',
  jobTitleName: 'Préparateur',
  pharmacyName: 'Pharmacie du Cygne',
  city: 'Strasbourg',
  postalCode: '67000',
  softwareName: 'LGPI',
  activityLabel: 'Préparateur Expert',
  periods: [{ start: '2026-09-10', end: '2026-09-12' }],
}

describe('runBadakanMissionMatching', () => {
  it('scores candidates who declared availability on the mission dates', async () => {
    const listCandidates = vi.fn(async () => [candidate])
    const listCompatibilities = vi.fn(async () => [{ candidateJobTitleId: 'jt-prep', score: 1 }])
    const provider = {
      complete: vi.fn(async () =>
        JSON.stringify([{ candidateId: 'c1', score: 88, justification: 'LGO LGPI + dispo' }]),
      ),
    }
    const result = await runBadakanMissionMatching('m1', {
      findMission: async () => mission,
      listCandidates,
      listCompatibilities,
      provider: provider as never,
      lookupGeo: async () => ({ lat: 48.58, lon: 7.74 }),
    })
    expect(listCandidates).toHaveBeenCalledWith({ from: '2026-09-10', to: '2026-09-12' })
    expect(result?.scored[0]).toMatchObject({ candidateId: 'c1', score: 88 })
  })

  it('returns null when the mission has no resolved métier', async () => {
    const result = await runBadakanMissionMatching('m1', {
      findMission: async () => ({ ...mission, jobTitleId: null }),
      listCandidates: async () => [],
      listCompatibilities: async () => [],
      provider: { complete: vi.fn() } as never,
    })
    expect(result).toBeNull()
  })
})
