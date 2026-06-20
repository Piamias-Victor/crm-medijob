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

  it('parse un wrapper { scores: [...] }', () => {
    const raw = JSON.stringify({
      scores: [{ candidateId: 'c1', score: 80, justification: 'ok' }],
    })
    expect(parseMatchingScoreResponse(raw)).toHaveLength(1)
    expect(parseMatchingScoreResponse(raw)[0]?.candidateId).toBe('c1')
  })

  it('parse encore un array direct (mock compat)', () => {
    const raw = JSON.stringify([{ candidateId: 'c2', score: 70, justification: 'legacy' }])
    expect(parseMatchingScoreResponse(raw)[0]?.candidateId).toBe('c2')
  })
})
