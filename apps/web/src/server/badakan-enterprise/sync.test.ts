import { describe, expect, it, vi } from 'vitest'
import { syncBadakanEnterprises } from './sync'
import type { BadakanEnterprise } from '@/server/badakan/map-enterprise'

const hermes: BadakanEnterprise = {
  badakanId: 'ent-hermes',
  name: 'Pharmacie Hermes',
  siret: '12345678901234',
  address: '1 rue de la Paix',
  city: 'Paris',
  postalCode: '75001',
  principal: {
    firstName: 'Dominique',
    lastName: 'Litzler',
    email: 'd.litzler@hermes.fr',
    phone: '0601020304',
  },
}

describe('syncBadakanEnterprises', () => {
  it('GETs unique enterprises and upserts pending, never a Pharmacy', async () => {
    const getEnterprise = vi.fn().mockResolvedValue(hermes)
    const upsertFromRead = vi.fn()
    const createPharmacy = vi.fn()
    const result = await syncBadakanEnterprises({
      listEnterpriseIds: async () => ['ent-hermes', 'ent-hermes'],
      getEnterprise,
      upsertFromRead,
    })
    expect(getEnterprise).toHaveBeenCalledTimes(1)
    expect(getEnterprise).toHaveBeenCalledWith('ent-hermes')
    expect(upsertFromRead).toHaveBeenCalledWith(hermes)
    expect(createPharmacy).not.toHaveBeenCalled()
    expect(result).toEqual({ fetched: 1, upserted: 1 })
  })

  it('upserts one enterprise when two ids share a SIRET', async () => {
    const polygoneA: BadakanEnterprise = { ...hermes, badakanId: 'ent-b', name: 'Polygone A' }
    const polygoneB: BadakanEnterprise = {
      ...hermes,
      badakanId: 'ent-a',
      name: 'Polygone B',
    }
    const getEnterprise = vi.fn(async (id: string) =>
      id === 'ent-a' ? polygoneB : polygoneA,
    )
    const upsertFromRead = vi.fn()
    const result = await syncBadakanEnterprises({
      listEnterpriseIds: async () => ['ent-b', 'ent-a'],
      getEnterprise,
      upsertFromRead,
    })
    expect(getEnterprise).toHaveBeenCalledTimes(2)
    expect(upsertFromRead).toHaveBeenCalledTimes(1)
    expect(upsertFromRead).toHaveBeenCalledWith(polygoneB)
    expect(result).toEqual({ fetched: 2, upserted: 1 })
  })

  it('skips ids that GET maps to null', async () => {
    const upsertFromRead = vi.fn()
    const result = await syncBadakanEnterprises({
      listEnterpriseIds: async () => ['gone'],
      getEnterprise: async () => null,
      upsertFromRead,
    })
    expect(upsertFromRead).not.toHaveBeenCalled()
    expect(result).toEqual({ fetched: 1, upserted: 0 })
  })
})
