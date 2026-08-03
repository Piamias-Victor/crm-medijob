// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { buildContactListWhere } from '@/server/db/repositories/contact-list-where'

describe('buildContactListWhere filters', () => {
  it('filtre par Contact roles', () => {
    expect(buildContactListWhere({ contactRoleIds: ['r1', 'r2'] })).toEqual({
      contactRoleId: { in: ['r1', 'r2'] },
    })
  })

  it('filtre pharmacie', () => {
    expect(buildContactListWhere({ pharmacyIds: ['p1'] })).toEqual({
      pharmacyId: { in: ['p1'] },
    })
  })

  it('filtre ville pharmacie', () => {
    expect(buildContactListWhere({ city: 'Lyon' })).toEqual({
      pharmacy: { city: { contains: 'Lyon', mode: 'insensitive' } },
    })
  })

  it('filtre contact principal oui', () => {
    expect(buildContactListWhere({ isPrimary: true })).toEqual({ isPrimary: true })
  })

  it('filtre contact principal non', () => {
    expect(buildContactListWhere({ isPrimary: false })).toEqual({ isPrimary: false })
  })

  it('filtre département via pharmacy.postalCode', () => {
    expect(buildContactListWhere({ departments: ['69', '75'] })).toEqual({
      pharmacy: { OR: [{ postalCode: { startsWith: '69' } }, { postalCode: { startsWith: '75' } }] },
    })
  })

  it('filtre statut pharmacie PROSPECT', () => {
    expect(buildContactListWhere({ pharmacyStatuses: ['PROSPECT'] })).toEqual({
      pharmacy: { status: { in: ['PROSPECT'] } },
    })
  })

  it('combine statut pharmacie + principal', () => {
    expect(
      buildContactListWhere({ pharmacyStatuses: ['PROSPECT'], isPrimary: true }),
    ).toEqual({
      AND: [{ isPrimary: true }, { pharmacy: { status: { in: ['PROSPECT'] } } }],
    })
  })

  it('filtre référent', () => {
    expect(buildContactListWhere({ referentIds: ['u1'] })).toEqual({
      referentId: { in: ['u1'] },
    })
  })
})
