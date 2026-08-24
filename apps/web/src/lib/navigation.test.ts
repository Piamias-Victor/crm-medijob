import { describe, expect, it } from 'vitest'
import { facturationSubNav } from '@/lib/navigation'

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
