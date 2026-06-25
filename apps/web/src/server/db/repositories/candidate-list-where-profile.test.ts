// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { buildCandidateListWhere } from '@/server/db/repositories/candidate-list-where'

describe('buildCandidateListWhere profile and missions', () => {
  it('filtre profil incomplet sans availableFrom', () => {
    expect(buildCandidateListWhere({ profileIncomplete: true })).toEqual({
      OR: [
        { OR: [{ city: null }, { city: '' }] },
        { OR: [{ postalCode: null }, { postalCode: '' }] },
        { mobilityRadiusKm: null },
      ],
    })
  })

  it('filtre profil complet sans exiger availableFrom', () => {
    expect(buildCandidateListWhere({ profileIncomplete: false })).toEqual({
      AND: [
        { NOT: { OR: [{ city: null }, { city: '' }] } },
        { NOT: { OR: [{ postalCode: null }, { postalCode: '' }] } },
        { mobilityRadiusKm: { not: null } },
      ],
    })
  })

  it('filtre mission active', () => {
    expect(buildCandidateListWhere({ activeMission: true })).toEqual({
      missions: { some: { mission: { status: { notIn: ['POURVU', 'ANNULEE'] } } } },
    })
  })

  it('filtre sans mission active', () => {
    expect(buildCandidateListWhere({ activeMission: false })).toEqual({
      NOT: { missions: { some: { mission: { status: { notIn: ['POURVU', 'ANNULEE'] } } } } },
    })
  })

  it('combine métier et département en ET', () => {
    expect(buildCandidateListWhere({ jobTitleIds: ['jt1'], departments: ['69'] })).toEqual({
      AND: [
        { jobTitleId: { in: ['jt1'] } },
        { OR: [{ postalCode: { startsWith: '69' } }] },
      ],
    })
  })
})
