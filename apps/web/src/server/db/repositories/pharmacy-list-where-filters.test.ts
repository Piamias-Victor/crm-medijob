// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { buildPharmacyListWhere } from '@/server/db/repositories/pharmacy-list-where'

describe('buildPharmacyListWhere filters', () => {
  it('filtre par statuts', () => {
    expect(buildPharmacyListWhere({ statuses: ['ACTIF', 'PROSPECT'] })).toEqual({
      status: { in: ['ACTIF', 'PROSPECT'] },
    })
  })

  it('filtre groupement', () => {
    expect(buildPharmacyListWhere({ groupementIds: ['g1'] })).toEqual({
      groupementId: { in: ['g1'] },
    })
  })

  it('filtre logiciel LGO', () => {
    expect(buildPharmacyListWhere({ softwareIds: ['sw1'] })).toEqual({
      softwareId: { in: ['sw1'] },
    })
  })

  it('filtre département via startsWith postalCode (sans postalCode = exclu)', () => {
    expect(buildPharmacyListWhere({ departments: ['69', '75'] })).toEqual({
      OR: [{ postalCode: { startsWith: '69' } }, { postalCode: { startsWith: '75' } }],
    })
  })

  it('filtre missions actives oui', () => {
    expect(buildPharmacyListWhere({ activeMission: true })).toEqual({
      missions: { some: { deletedAt: null, status: { notIn: ['POURVU', 'ANNULEE'] } } },
    })
  })

  it('filtre missions actives non', () => {
    expect(buildPharmacyListWhere({ activeMission: false })).toEqual({
      NOT: { missions: { some: { deletedAt: null, status: { notIn: ['POURVU', 'ANNULEE'] } } } },
    })
  })

  it('combine ACTIF + groupement Giphar', () => {
    expect(buildPharmacyListWhere({ statuses: ['ACTIF'], groupementIds: ['giphar'] })).toEqual({
      AND: [{ status: { in: ['ACTIF'] } }, { groupementId: { in: ['giphar'] } }],
    })
  })
})
