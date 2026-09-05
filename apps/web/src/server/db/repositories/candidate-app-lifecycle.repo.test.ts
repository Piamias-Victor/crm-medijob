import { describe, expect, it, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import { makeCandidateAppLifecycleRepository } from './candidate-app-lifecycle.repo'

describe('candidate app lifecycle repository', () => {
  it('writes Inactif and remembered status, never Blacklisté', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'c1' })
    const repo = makeCandidateAppLifecycleRepository({
      candidate: { update },
    } as unknown as PrismaClient)
    await repo.applyAppLifecycle('c1', {
      status: 'INACTIF',
      statusBeforeInactive: 'QUALIFIE',
    })
    expect(update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { status: 'INACTIF', statusBeforeInactive: 'QUALIFIE' },
      select: { id: true },
    })
    expect(update.mock.calls[0]?.[0].data.status).not.toBe('BLACKLISTE')
  })

  it('lists App-origin badakan ids for inactive probe', async () => {
    const findMany = vi.fn().mockResolvedValue([{ badakanId: 'bk-marie' }])
    const repo = makeCandidateAppLifecycleRepository({
      candidate: { findMany },
    } as unknown as PrismaClient)
    await expect(repo.listAppLinkedBadakanIds()).resolves.toEqual(['bk-marie'])
  })
})
