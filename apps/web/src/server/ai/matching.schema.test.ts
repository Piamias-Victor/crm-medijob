// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { parseMatchingScoreResponse } from '@/server/ai/matching.schema'

describe('parseMatchingScoreResponse', () => {
  it('parses a valid scoring array', () => {
    const raw = JSON.stringify([
      { candidateId: 'c1', score: 82, justification: 'Profil aligné sur la mission.' },
    ])
    expect(parseMatchingScoreResponse(raw)).toEqual([
      { candidateId: 'c1', score: 82, justification: 'Profil aligné sur la mission.' },
    ])
  })

  it('rejects invalid scores', () => {
    const raw = JSON.stringify([{ candidateId: 'c1', score: 120, justification: 'x' }])
    expect(() => parseMatchingScoreResponse(raw)).toThrow()
  })

  it('rejects non-json payloads', () => {
    expect(() => parseMatchingScoreResponse('not-json')).toThrow('AI_RESPONSE_NOT_JSON')
  })
})
