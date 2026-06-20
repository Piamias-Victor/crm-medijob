import { describe, it, expect, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import { makeContactRepository } from '@/server/db/repositories/contact.repository'

describe('makeContactRepository listByPharmacyIds', () => {
  it('retourne contacts groupables par pharmacyId en une requête', async () => {
    const findMany = vi.fn().mockResolvedValue([
      { id: 'c1', firstName: 'Marie', lastName: 'Curie', pharmacyId: 'p1' },
      { id: 'c2', firstName: 'Paul', lastName: 'Bert', pharmacyId: 'p2' },
    ])
    const repo = makeContactRepository({ contact: { findMany } } as unknown as PrismaClient)

    const rows = await repo.listByPharmacyIds(['p1', 'p2'])

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ pharmacyId: { in: ['p1', 'p2'] } }),
      }),
    )
    expect(rows).toHaveLength(2)
  })

  it('retourne tableau vide si aucun pharmacyId', async () => {
    const findMany = vi.fn()
    const repo = makeContactRepository({ contact: { findMany } } as unknown as PrismaClient)
    expect(await repo.listByPharmacyIds([])).toEqual([])
    expect(findMany).not.toHaveBeenCalled()
  })
})

describe('makeContactRepository search', () => {
  it('filters contacts by name in a case-insensitive way', async () => {
    const findMany = vi.fn().mockResolvedValue([
      {
        id: 'c1',
        firstName: 'Marie',
        lastName: 'Curie',
        email: 'marie@example.com',
        pharmacy: { name: 'Pharmacie du Centre' },
      },
      {
        id: 'c2',
        firstName: 'Paul',
        lastName: 'Bert',
        email: null,
        pharmacy: { name: 'Pharmacie Gare' },
      },
    ])
    const repo = makeContactRepository({ contact: { findMany } } as unknown as PrismaClient)

    const results = await repo.search('marie')

    expect(results).toHaveLength(1)
    expect(results[0]?.id).toBe('c1')
  })
})
