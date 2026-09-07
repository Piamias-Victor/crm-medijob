// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { buildCandidateListWhere } from '@/server/db/repositories/candidate-list-where'

describe('buildCandidateListWhere validatedWithinHours', () => {
  it('keeps Candidates stamped by Badakan within the given window', () => {
    const now = new Date('2026-09-06T12:00:00.000Z')
    expect(buildCandidateListWhere({ validatedWithinHours: 24 }, now)).toEqual({
      badakanValidatedAt: { gte: new Date('2026-09-05T12:00:00.000Z') },
    })
  })

  it('keeps Candidates stamped by Badakan when the filter is on', () => {
    expect(buildCandidateListWhere({ badakanValidated: true })).toEqual({
      badakanValidatedAt: { not: null },
    })
  })
})
