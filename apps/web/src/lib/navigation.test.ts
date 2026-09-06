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
  it('lists Accueil first then Suivi Besoins Candidats Dispos Officines', () => {
    expect(interimSubNav.map((item) => [item.label, item.href])).toEqual([
      ['Accueil', '/interim'],
      ['Suivi', '/interim/suivi'],
      ['Besoins', '/interim/besoins'],
      ['Candidats', '/interim/candidats'],
      ['Dispos', '/interim/disponibilites'],
      ['Officines', '/interim/officines'],
    ])
    expect(interimSubNav.some((item) => item.href === '/missions')).toBe(false)
  })
})
