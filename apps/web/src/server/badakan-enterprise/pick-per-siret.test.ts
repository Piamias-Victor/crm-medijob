import { describe, expect, it } from 'vitest'
import type { BadakanEnterprise } from '@/server/badakan/map-enterprise'
import { pickEnterprisePerSiret } from './pick-per-siret'

function row(badakanId: string, siret: string | null, name: string): BadakanEnterprise {
  return {
    badakanId,
    name,
    siret,
    address: null,
    city: null,
    postalCode: null,
    principal: null,
  }
}

describe('pickEnterprisePerSiret', () => {
  it('keeps one enterprise per SIRET, the lowest badakanId', () => {
    const a = row('ent-b', '87961088900021', 'Pharmacie Polygone Riviera')
    const b = row('ent-a', '87961088900021', 'PHARMACIE POLYGONE RIVIERA')
    expect(pickEnterprisePerSiret([a, b])).toEqual([b])
  })

  it('keeps distinct SIRETs', () => {
    const a = row('ent-a', '111', 'A')
    const b = row('ent-b', '222', 'B')
    expect(pickEnterprisePerSiret([a, b])).toEqual([a, b])
  })

  it('keeps enterprises that have no SIRET', () => {
    const a = row('ent-a', null, 'Sans SIRET')
    expect(pickEnterprisePerSiret([a])).toEqual([a])
  })
})
