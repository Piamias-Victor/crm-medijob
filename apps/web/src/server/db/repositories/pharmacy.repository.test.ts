// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import { makePharmacyRepository } from '@/server/db/repositories/pharmacy.repository'

describe('makePharmacyRepository list', () => {
  it('applique filtres statut et groupement', async () => {
    const findMany = vi.fn().mockResolvedValue([])
    const repo = makePharmacyRepository({ pharmacy: { findMany } } as unknown as PrismaClient)
    await repo.list({ statuses: ['ACTIF'], groupementIds: ['g1'] })
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [
            { deletedAt: null },
            {
              AND: [{ status: { in: ['ACTIF'] } }, { groupementId: { in: ['g1'] } }],
            },
          ],
        },
      }),
    )
  })

  it('does not cap the portefeuille list at 500', async () => {
    const findMany = vi.fn().mockResolvedValue([])
    const repo = makePharmacyRepository({ pharmacy: { findMany } } as unknown as PrismaClient)
    await repo.list()
    expect(findMany.mock.calls[0]?.[0]).not.toHaveProperty('take')
  })

  it('searches every pharmacy in SQL, not a 500-row pool', async () => {
    const findMany = vi.fn().mockResolvedValue([])
    const repo = makePharmacyRepository({ pharmacy: { findMany } } as unknown as PrismaClient)
    await repo.search('Fauret', 8)
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 8,
        where: {
          AND: [
            { deletedAt: null },
            expect.objectContaining({
              OR: expect.arrayContaining([
                { name: { contains: 'Fauret', mode: 'insensitive' } },
              ]),
            }),
          ],
        },
      }),
    )
  })
})
