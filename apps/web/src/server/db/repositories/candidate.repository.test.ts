// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import { KANBAN_MISSIONS_LIMIT } from '@/lib/kanban-limits'
import { makeCandidateRepository } from '@/server/db/repositories/candidate.repository'

describe('makeCandidateRepository listForKanban', () => {
  it('limite missions nested par candidat', async () => {
    const findMany = vi.fn().mockResolvedValue([])
    const repo = makeCandidateRepository({ candidate: { findMany } } as unknown as PrismaClient)
    await repo.listForKanban()
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          missions: expect.objectContaining({ take: KANBAN_MISSIONS_LIMIT }),
        }),
      }),
    )
  })

  it('applique filtres métier et département', async () => {
    const findMany = vi.fn().mockResolvedValue([])
    const repo = makeCandidateRepository({ candidate: { findMany } } as unknown as PrismaClient)
    await repo.listForKanban({ jobTitleIds: ['jt1'], departments: ['69'] })
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [
            { deletedAt: null },
            {
              AND: [
                { jobTitleId: { in: ['jt1'] } },
                { OR: [{ postalCode: { startsWith: '69' } }] },
              ],
            },
          ],
        },
      }),
    )
  })
})
