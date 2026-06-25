import { describe, it, expect } from 'vitest'
import { radiusPostalCodePrefix } from '@/lib/geo/radius-postal-code-prefix'

describe('radiusPostalCodePrefix', () => {
  it('narrows DB scan to department for small radius', () => {
    expect(radiusPostalCodePrefix('83400', 30)).toBe('83')
  })

  it('skips prefix for large radius', () => {
    expect(radiusPostalCodePrefix('83400', 120)).toBeNull()
  })
})
