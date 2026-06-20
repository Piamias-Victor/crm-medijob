import { describe, it, expect } from 'vitest'
import { toNull } from '@/view-models/to-null'

describe('toNull', () => {
  it('returns null for undefined optional strings', () => {
    expect(toNull(undefined)).toBeNull()
  })

  it('preserves provided strings', () => {
    expect(toNull('Lyon')).toBe('Lyon')
  })
})
