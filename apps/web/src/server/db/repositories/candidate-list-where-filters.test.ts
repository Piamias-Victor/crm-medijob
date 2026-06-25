// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { buildCandidateListWhere } from '@/server/db/repositories/candidate-list-where'

const now = new Date('2026-06-24T12:00:00.000Z')

describe('buildCandidateListWhere filters', () => {
  it('filtre par jobTitleIds', () => {
    expect(buildCandidateListWhere({ jobTitleIds: ['jt1', 'jt2'] })).toEqual({
      jobTitleId: { in: ['jt1', 'jt2'] },
    })
  })

  it('filtre département via startsWith postalCode', () => {
    expect(buildCandidateListWhere({ departments: ['69', '75'] })).toEqual({
      OR: [{ postalCode: { startsWith: '69' } }, { postalCode: { startsWith: '75' } }],
    })
  })

  it('filtre référent', () => {
    expect(buildCandidateListWhere({ referentIds: ['u1'] })).toEqual({
      referentId: { in: ['u1'] },
    })
  })

  it('filtre logiciel LGO', () => {
    expect(buildCandidateListWhere({ softwareIds: ['sw1'] })).toEqual({
      softwares: { some: { softwareId: { in: ['sw1'] } } },
    })
  })

  it('filtre contrat préféré', () => {
    expect(buildCandidateListWhere({ contractTypes: ['CDI', 'INTERIM'] })).toEqual({
      contractPreferences: { some: { contractType: { in: ['CDI', 'INTERIM'] } } },
    })
  })

  it('filtre disponible oui — date ok et pas en mission', () => {
    expect(buildCandidateListWhere({ available: true }, now)).toEqual({
      AND: [
        { OR: [{ availableFrom: null }, { availableFrom: { lte: now } }] },
        { NOT: { missions: { some: { mission: { deletedAt: null, status: { notIn: ['POURVU', 'ANNULEE'] } } } } } },
      ],
    })
  })

  it('filtre disponible non — date future ou en mission', () => {
    expect(buildCandidateListWhere({ available: false }, now)).toEqual({
      OR: [
        { availableFrom: { gt: now } },
        { missions: { some: { mission: { deletedAt: null, status: { notIn: ['POURVU', 'ANNULEE'] } } } } },
      ],
    })
  })
})
