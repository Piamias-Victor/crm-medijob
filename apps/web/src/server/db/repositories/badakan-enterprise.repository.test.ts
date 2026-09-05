import { describe, expect, it, vi } from 'vitest'
import { makeBadakanEnterpriseRepository } from './badakan-enterprise.repository'
import type { BadakanEnterprise } from '@/server/badakan/map-enterprise'

const mapped: BadakanEnterprise = {
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

function mockDb() {
  return {
    badakanEnterprise: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
  }
}

describe('badakanEnterpriseRepository', () => {
  it('lists pending enterprises that are not yet a Pharmacy', async () => {
    const db = mockDb()
    db.badakanEnterprise.findMany.mockResolvedValue([{ id: 'row1', ...mapped }])
    const repo = makeBadakanEnterpriseRepository(db as never)
    const rows = await repo.listPending(10)
    expect(rows).toHaveLength(1)
    expect(db.badakanEnterprise.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { verifiedAt: null },
        take: 10,
      }),
    )
  })

  it('upserts a read snapshot without setting pharmacyId', async () => {
    const db = mockDb()
    db.badakanEnterprise.upsert.mockResolvedValue({ id: 'row1' })
    const repo = makeBadakanEnterpriseRepository(db as never)
    await repo.upsertFromRead(mapped)
    expect(db.badakanEnterprise.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { badakanId: 'ent-hermes' },
        create: expect.objectContaining({
          name: 'Pharmacie Hermes',
          siret: '12345678901234',
          principalEmail: 'd.litzler@hermes.fr',
        }),
      }),
    )
    const create = (db.badakanEnterprise.upsert.mock.calls[0]?.[0] as { create: object })
      .create
    expect(create).not.toHaveProperty('pharmacyId')
    expect(create).not.toHaveProperty('verifiedAt')
  })
})
