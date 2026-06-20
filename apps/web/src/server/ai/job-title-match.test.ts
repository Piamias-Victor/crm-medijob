// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { matchJobTitles } from '@/server/ai/job-title-match'

const titles = [
  { id: 'jt1', name: 'Pharmacien' },
  { id: 'jt2', name: 'Préparateur en pharmacie' },
  { id: 'jt3', name: 'Pharmacien adjoint' },
]

describe('matchJobTitles', () => {
  it('returns exact match first', () => {
    const matches = matchJobTitles('Pharmacien', titles)
    expect(matches[0]?.id).toBe('jt1')
  })

  it('returns partial matches for fuzzy labels', () => {
    const matches = matchJobTitles('pharmacien adjoint', titles)
    expect(matches.map((m) => m.id)).toContain('jt3')
  })

  it('returns empty list for blank input', () => {
    expect(matchJobTitles('   ', titles)).toEqual([])
  })
})
