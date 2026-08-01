// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { makeDeps, pharmacyCaller } from '@/server/routers/pharmacy.test.deps'

describe('pharmacyRouter import/dedup', () => {
  it('detects duplicate by SIRET', async () => {
    const deps = makeDeps({
      findIdentityBySiret: vi.fn().mockResolvedValue({
        id: 'p-exist',
        name: 'Existante',
        siret: '12345678901234',
        city: 'Paris',
        postalCode: '75001',
        deletedAt: null,
      }),
    })
    const matches = await pharmacyCaller(deps).detectDuplicate({
      siret: '12345678901234',
      name: 'Autre',
    })
    expect(matches).toEqual([
      expect.objectContaining({ pharmacyId: 'p-exist', reason: 'siret' }),
    ])
  })

  it('commits clean rows and returns duplicate queue', async () => {
    const deps = makeDeps({
      findIdentityBySiret: vi.fn().mockImplementation(async (siret: string) =>
        siret === '12345678901234'
          ? {
              id: 'p-exist',
              name: 'Existante',
              siret: '12345678901234',
              city: 'Paris',
              postalCode: '75001',
              deletedAt: null,
            }
          : null,
      ),
    })
    const result = await pharmacyCaller(deps).commitImport([
      { name: 'Nouvelle', status: 'PROSPECT' },
      { name: 'Doublon', siret: '12345678901234', status: 'PROSPECT' },
    ])
    expect(result.createdIds).toEqual(['new'])
    expect(result.duplicates).toHaveLength(1)
    expect(deps.pharmacies.create).toHaveBeenCalledOnce()
  })
})
