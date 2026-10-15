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
            expect.objectContaining({
              NOT: expect.objectContaining({ appProfiles: expect.anything() }),
            }),
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

  it('lists CVthèque beyond the 500 default list cap', async () => {
    const findMany = vi.fn().mockResolvedValue([])
    const repo = makeCandidateRepository({ candidate: { findMany } } as unknown as PrismaClient)
    await repo.listForKanban()
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 10_000 }))
  })

  it('searches every candidate by name, not the first 500 last names', async () => {
    const findMany = vi.fn().mockResolvedValue([])
    const repo = makeCandidateRepository({ candidate: { findMany } } as unknown as PrismaClient)
    await repo.search('Fauret', 8)
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 8,
        where: {
          AND: [
            { deletedAt: null },
            expect.objectContaining({
              OR: expect.arrayContaining([
                { lastName: { contains: 'Fauret', mode: 'insensitive' } },
              ]),
            }),
          ],
        },
      }),
    )
  })

  it('frees badakanId when soft-deleting so cron can relink', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'c1' })
    const repo = makeCandidateRepository({ candidate: { update } } as unknown as PrismaClient)
    await repo.softDelete('c1')
    expect(update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { deletedAt: expect.any(Date), badakanId: null },
    })
  })
})
