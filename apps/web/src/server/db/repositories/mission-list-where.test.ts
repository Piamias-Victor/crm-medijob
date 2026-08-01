// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { buildMissionListWhere } from '@/server/db/repositories/mission-list-where'
import { REFERENT_NONE } from '@/lib/constants/referent-none'

describe('buildMissionListWhere', () => {
  it('filtre type de contrat', () => {
    expect(buildMissionListWhere({ contractTypes: ['CDI', 'VACATION'] })).toEqual({
      contractType: { in: ['CDI', 'VACATION'] },
    })
  })

  it('filtre statut', () => {
    expect(buildMissionListWhere({ statuses: ['A_POURVOIR', 'EN_RECHERCHE'] })).toEqual({
      status: { in: ['A_POURVOIR', 'EN_RECHERCHE'] },
    })
  })

  it('filtre référent', () => {
    expect(buildMissionListWhere({ referentIds: ['u1'] })).toEqual({
      referentId: { in: ['u1'] },
    })
  })

  it('filtre sans référent', () => {
    expect(buildMissionListWhere({ referentIds: [REFERENT_NONE] })).toEqual({
      referentId: null,
    })
  })

  it('filtre métier + pharmacie + ville', () => {
    expect(
      buildMissionListWhere({
        jobTitleIds: ['jt1'],
        pharmacyIds: ['p1'],
        city: 'Lyon',
      }),
    ).toEqual({
      AND: [
        { jobTitleId: { in: ['jt1'] } },
        { pharmacyId: { in: ['p1'] } },
        { pharmacy: { city: { contains: 'Lyon', mode: 'insensitive' } } },
      ],
    })
  })

  it('filtre département via pharmacy.postalCode', () => {
    expect(buildMissionListWhere({ departments: ['69'] })).toEqual({
      pharmacy: { OR: [{ postalCode: { startsWith: '69' } }] },
    })
  })

  it('filtre période sur createdAt', () => {
    expect(
      buildMissionListWhere({
        createdFrom: '2026-01-01',
        createdTo: '2026-01-31',
      }),
    ).toEqual({
      createdAt: {
        gte: new Date('2026-01-01T00:00:00.000Z'),
        lte: new Date('2026-01-31T23:59:59.999Z'),
      },
    })
  })
})
