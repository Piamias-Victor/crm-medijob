import { describe, it, expect, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import { makePharmacyRepository } from '@/server/db/repositories/pharmacy.repository'

describe('makePharmacyRepository list', () => {
  it('loads only the primary contact for portfolio rows', async () => {
    const findMany = vi.fn().mockResolvedValue([])
    const repo = makePharmacyRepository({ pharmacy: { findMany } } as unknown as PrismaClient)

    await repo.list()

    const include = findMany.mock.calls[0]?.[0]?.include as {
      contacts: { take: number; where: { isPrimary: boolean; deletedAt: null } }
    }
    expect(include.contacts.take).toBe(1)
    expect(include.contacts.where.isPrimary).toBe(true)
  })
})
