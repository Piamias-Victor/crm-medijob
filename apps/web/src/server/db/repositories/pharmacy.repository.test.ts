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
})
