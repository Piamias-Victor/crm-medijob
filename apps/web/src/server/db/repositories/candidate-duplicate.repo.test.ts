// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { makeCandidateDuplicateRepository } from './candidate-duplicate.repo'

describe('makeCandidateDuplicateRepository', () => {
  it('filters name+phone lookup by phone suffix in SQL', async () => {
    const findMany = vi.fn().mockResolvedValue([
      { id: 'c1', firstName: 'Alice', lastName: 'Martin', email: null, phone: '0600000001' },
    ])
    const repo = makeCandidateDuplicateRepository({ candidate: { findMany, findFirst: vi.fn() } } as never)

    const hit = await repo.findIdentityByNamePhone('Alice', 'Martin', '06 00 00 00 01')

    expect(hit?.id).toBe('c1')
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          phone: { contains: '600000001' },
        }),
        take: 25,
      }),
    )
  })
})
