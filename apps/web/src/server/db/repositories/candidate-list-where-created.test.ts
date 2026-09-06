// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { buildCandidateListWhere } from '@/server/db/repositories/candidate-list-where'

describe('buildCandidateListWhere createdWithinHours', () => {
  it('keeps candidates created within the given window', () => {
    const now = new Date('2026-09-06T12:00:00.000Z')
    expect(buildCandidateListWhere({ createdWithinHours: 24 }, now)).toEqual({
      createdAt: { gte: new Date('2026-09-05T12:00:00.000Z') },
    })
  })
})
