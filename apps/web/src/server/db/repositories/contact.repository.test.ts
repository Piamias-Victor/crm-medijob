import { describe, it, expect, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import { makeContactRepository } from '@/server/db/repositories/contact.repository'

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
