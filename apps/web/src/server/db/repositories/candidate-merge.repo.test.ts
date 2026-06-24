// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import { CandidateMergeError } from '@/server/candidate/validate-merge-candidates'
import {
  makeMergeRepo,
  makeMergeTx,
  mergeProfile,
  runMergeTx,
} from './candidate-merge.repo.test-fixtures'

describe('makeCandidateMergeRepository', () => {
  it('soft-deletes absorbed candidate and updates kept profile', async () => {
    const tx = makeMergeTx()
    const repo = makeMergeRepo({ $transaction: runMergeTx(tx) } as unknown as PrismaClient)

    const result = await repo.merge('kept', 'absorbed', mergeProfile)

    expect(result).toEqual({ id: 'kept' })
    expect(tx.candidate.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'absorbed' }, data: { deletedAt: expect.any(Date) } }),
    )
    expect(tx.missionCandidate.findUnique).not.toHaveBeenCalled()
  })

  it('transfers mission candidates without per-row kept lookup', async () => {
    const missionCandidate = {
      findMany: vi
        .fn()
        .mockResolvedValueOnce([{ missionId: 'm1', candidateId: 'absorbed' }])
        .mockResolvedValueOnce([]),
      findUnique: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    }
    const tx = makeMergeTx({ missionCandidate })
    const repo = makeMergeRepo({ $transaction: runMergeTx(tx) } as unknown as PrismaClient)

    await repo.merge('kept', 'absorbed', mergeProfile)

    expect(missionCandidate.findMany).toHaveBeenCalledTimes(2)
    expect(missionCandidate.findUnique).not.toHaveBeenCalled()
    expect(missionCandidate.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { candidateId: 'kept' } }),
    )
  })

  it('rejects merge when kept candidate is missing', async () => {
    const candidate = { findFirst: vi.fn().mockResolvedValue(null), update: vi.fn() }
    const repo = makeMergeRepo({
      $transaction: vi.fn(async (fn: (inner: { candidate: typeof candidate }) => Promise<void>) =>
        fn({ candidate }),
      ),
    } as unknown as PrismaClient)

    await expect(repo.merge('missing', undefined, mergeProfile)).rejects.toBeInstanceOf(CandidateMergeError)
  })
})
