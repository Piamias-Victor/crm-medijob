import { describe, expect, it } from 'vitest'
import { facturationSubNav, interimSubNav, navItems, visibleNavItems } from '@/lib/navigation'

describe('facturationSubNav', () => {
  it('lists Vue d’ensemble, Pilotage, Placements and Intérim', () => {
    expect(facturationSubNav.map((item) => [item.label, item.href])).toEqual([
      ['Vue d’ensemble', '/facturation'],
      ['Pilotage', '/facturation/pilotage'],
      ['Placements', '/facturation/placements'],
      ['Intérim', '/facturation/interim'],
    ])
  })
})

describe('navItems', () => {
  it('lists operational Intérim apart from Facturation Intérim', () => {
    expect(navItems.map((item) => [item.label, item.href])).toContainEqual([
      'Intérim',
      '/interim',
    ])
    expect(navItems.some((item) => item.href === '/facturation/interim')).toBe(false)
  })

  it('shows Intérim to a recruteur', () => {
    expect(visibleNavItems('RECRUTEUR').some((item) => item.href === '/interim')).toBe(
      true,
    )
  })
})

describe('interimSubNav', () => {
  it('lists Badakan missions apart from the CRM Mission kanban', () => {
    expect(interimSubNav.map((item) => [item.label, item.href])).toEqual([
      ['Missions Badakan', '/interim/missions'],
      ['Vérif officines', '/interim/officines'],
      ['Disponibilités', '/interim/disponibilites'],
    ])
    expect(interimSubNav.some((item) => item.href === '/missions')).toBe(false)
  })
})
