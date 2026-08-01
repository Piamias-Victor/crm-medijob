import { describe, it, expect } from 'vitest'
import { BRAND_LOGO_SRC, BRAND_MARK_SRC } from '@/lib/brand-assets'

describe('brand assets', () => {
  it('resolves bundled logo and mark sources', () => {
    expect(BRAND_LOGO_SRC).toMatch(/medijob-logo/)
    expect(BRAND_MARK_SRC).toMatch(/medijob-mark/)
  })
})
