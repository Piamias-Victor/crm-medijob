import { describe, expect, it, vi } from 'vitest'
import { buildCandidateListQuery } from '@/server/db/repositories/candidate-list-query'
import { candidateCvthequeSelect } from '@/server/db/repositories/candidate-cvtheque.select'

describe('buildCandidateListQuery', () => {
  it('applies take only when a limit is provided', async () => {
    const findMany = vi.fn().mockResolvedValue([])
    const db = { candidate: { findMany } } as never

    await buildCandidateListQuery(db, {}, candidateCvthequeSelect)
    expect(findMany).toHaveBeenCalledWith(
      expect.not.objectContaining({ take: expect.anything() }),
    )

    await buildCandidateListQuery(db, {}, candidateCvthequeSelect, 500)
    expect(findMany).toHaveBeenLastCalledWith(expect.objectContaining({ take: 500 }))
  })
})
