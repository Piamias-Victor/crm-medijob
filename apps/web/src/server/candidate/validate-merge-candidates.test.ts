import { describe, it, expect, vi } from 'vitest'
import {
  assertMergeCandidatesValid,
  CandidateMergeError,
} from '@/server/candidate/validate-merge-candidates'

describe('assertMergeCandidatesValid', () => {
  const findFirst = (kept: unknown, absorbed: unknown) =>
    vi.fn(async ({ where }: { where: { id: string } }) => {
      if (where.id === 'kept') return kept
      if (where.id === 'absorbed') return absorbed
      return null
    })

  it('rejects same kept and absorbed id', async () => {
    await expect(
      assertMergeCandidatesValid({ candidate: { findFirst: findFirst({}, {}) } } as never, 'c1', 'c1'),
    ).rejects.toMatchObject({ code: 'SAME_ID' })
  })

  it('rejects missing kept candidate', async () => {
    await expect(
      assertMergeCandidatesValid({ candidate: { findFirst: findFirst(null, {}) } } as never, 'kept'),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })
})
