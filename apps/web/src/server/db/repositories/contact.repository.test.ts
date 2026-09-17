import { describe, it, expect, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import { makeContactRepository } from '@/server/db/repositories/contact.repository'

describe('makeContactRepository list', () => {
  it('applique filtres repository sur findMany', async () => {
    const findMany = vi.fn().mockResolvedValue([])
    const repo = makeContactRepository({ contact: { findMany } } as unknown as PrismaClient)

    await repo.list({ isPrimary: true, pharmacyStatuses: ['PROSPECT'] })

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [
            { deletedAt: null },
            { pharmacy: { deletedAt: null } },
            {
              AND: [
                { isPrimary: true },
                { pharmacy: { status: { in: ['PROSPECT'] } } },
              ],
            },
          ],
        },
      }),
    )
  })
})

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
  it('searches every contact by name in SQL, not a 500-row pool', async () => {
    const findMany = vi.fn().mockResolvedValue([
      {
        id: 'c1',
        firstName: 'Marie',
        lastName: 'Curie',
        email: 'marie@example.com',
        pharmacy: { name: 'Pharmacie du Centre' },
      },
    ])
    const repo = makeContactRepository({ contact: { findMany } } as unknown as PrismaClient)
    const results = await repo.search('marie')
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 8,
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            { deletedAt: null },
            expect.objectContaining({
              OR: expect.arrayContaining([
                { lastName: { contains: 'marie', mode: 'insensitive' } },
              ]),
            }),
          ]),
        }),
      }),
    )
    expect(results).toHaveLength(1)
  })
})
