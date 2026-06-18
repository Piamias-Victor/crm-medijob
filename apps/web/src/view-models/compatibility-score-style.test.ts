import { describe, it, expect } from 'vitest'
import { compatibilityScoreStyle } from '@/view-models/compatibility-score-style'

describe('compatibilityScoreStyle', () => {
  it('marks 0% as excluded', () => {
    expect(compatibilityScoreStyle(0)).toContain('text-fg-muted')
  })

  it('marks 100% as strong match', () => {
    expect(compatibilityScoreStyle(100)).toContain('text-success')
  })

  it('marks mid scores as partial match', () => {
    expect(compatibilityScoreStyle(50)).toContain('text-warning')
  })
})
