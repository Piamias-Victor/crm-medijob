import { describe, it, expect } from 'vitest'
import { adminNavLinkClass } from '@/view-models/admin-nav-link'

describe('adminNavLinkClass', () => {
  it('gives inactive tabs a bordered surface and readable text', () => {
    const cls = adminNavLinkClass(false)
    expect(cls).toContain('border-border')
    expect(cls).toContain('bg-white')
    expect(cls).toContain('text-fg')
  })

  it('highlights the active tab with accent fill', () => {
    const cls = adminNavLinkClass(true)
    expect(cls).toContain('bg-accent')
    expect(cls).toContain('text-accent-fg')
  })
})
