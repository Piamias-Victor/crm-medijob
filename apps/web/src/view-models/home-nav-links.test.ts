import { describe, expect, it } from 'vitest'
import { buildHomeNavLinks } from './home-nav-links'

describe('buildHomeNavLinks', () => {
  it('routes candidats pill to inbox when applications are pending', () => {
    const links = buildHomeNavLinks({ missionsActive: 3, inboxPending: 2 })
    const candidats = links.find((link) => link.label === 'Candidats')
    expect(candidats?.href).toBe('/candidats?tab=inbox')
    expect(candidats?.badge).toBe(2)
  })
})
