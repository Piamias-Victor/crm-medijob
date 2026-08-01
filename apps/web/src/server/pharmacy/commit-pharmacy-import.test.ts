import { describe, expect, it, vi } from 'vitest'
import { commitPharmacyImport } from '@/server/pharmacy/commit-pharmacy-import'
import type { PharmacyCsvImportRow } from '@/view-models/pharmacy-csv-import.schema'

const row = (overrides: Partial<PharmacyCsvImportRow> = {}): PharmacyCsvImportRow => ({
  name: 'Pharmacie A',
  status: 'PROSPECT',
  ...overrides,
})

describe('commitPharmacyImport', () => {
  it('creates rows without duplicates', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'new-1' })
    const result = await commitPharmacyImport([row({ name: 'Nouvelle' })], {
      detectDuplicates: async () => [],
      create,
    })
    expect(result.createdIds).toEqual(['new-1'])
    expect(result.duplicates).toEqual([])
    expect(create).toHaveBeenCalledOnce()
  })

  it('queues SIRET duplicates for merge instead of creating', async () => {
    const create = vi.fn()
    const result = await commitPharmacyImport(
      [row({ siret: '12345678901234', city: 'Paris', postalCode: '75001' })],
      {
        detectDuplicates: async () => [
          {
            pharmacyId: 'exist-1',
            reason: 'siret',
            name: 'Existante',
            siret: '12345678901234',
            city: 'Paris',
            postalCode: '75001',
            deletedAt: null,
          },
        ],
        create,
      },
    )
    expect(result.createdIds).toEqual([])
    expect(result.duplicates).toHaveLength(1)
    expect(result.duplicates[0]?.matches[0]?.pharmacyId).toBe('exist-1')
    expect(create).not.toHaveBeenCalled()
  })
})
