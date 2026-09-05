// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { interimExtraLinks, interimNavItems } from './interim-nav-items'
import { interimSecondaryLinks, interimSubNav } from '@/lib/navigation'

describe('interimNavItems', () => {
  it('adds an icon for every primary interim entry', () => {
    const items = interimNavItems()
    expect(items).toHaveLength(interimSubNav.length)
    expect(items[0]?.href).toBe('/interim')
    expect(items.every((item) => Boolean(item.icon))).toBe(true)
  })
})

describe('interimExtraLinks', () => {
  it('keeps missions contrats officines as secondary links', () => {
    expect(interimExtraLinks().map((item) => item.href)).toEqual(
      interimSecondaryLinks.map((item) => item.href),
    )
  })
})
