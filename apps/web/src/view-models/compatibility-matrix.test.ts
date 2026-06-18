import { describe, it, expect } from 'vitest'
import {
  buildCompatibilityScores,
  compatibilityKey,
} from '@/view-models/compatibility-matrix'

describe('buildCompatibilityScores', () => {
  const pairs = [
    { missionJobTitleId: 'm1', candidateJobTitleId: 'c1', score: 100 },
    { missionJobTitleId: 'm1', candidateJobTitleId: 'c2', score: 60 },
  ]

  it('maps each pair to its score', () => {
    const scores = buildCompatibilityScores(pairs)
    expect(scores.get(compatibilityKey('m1', 'c1'))).toBe(100)
    expect(scores.get(compatibilityKey('m1', 'c2'))).toBe(60)
  })

  it('returns 0 for pairs not in the matrix', () => {
    const scores = buildCompatibilityScores(pairs)
    expect(scores.get(compatibilityKey('m2', 'c1')) ?? 0).toBe(0)
  })
})
