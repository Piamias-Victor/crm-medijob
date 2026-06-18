import { describe, it, expect } from 'vitest'
import { pillNavLinkClass } from '@/view-models/pill-nav-link'

describe('pillNavLinkClass', () => {
  it('gives inactive tabs a bordered surface and readable text', () => {
    const cls = pillNavLinkClass(false)
    expect(cls).toContain('border-border')
    expect(cls).toContain('bg-white')
    expect(cls).toContain('text-fg')
  })

  it('highlights the active tab with accent fill', () => {
    const cls = pillNavLinkClass(true)
    expect(cls).toContain('bg-accent')
    expect(cls).toContain('text-accent-fg')
  })
})
