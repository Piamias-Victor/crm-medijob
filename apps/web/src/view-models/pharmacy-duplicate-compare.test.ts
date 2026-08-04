import { describe, it, expect } from 'vitest'
import { toPharmacyDuplicateRowFromFormSource } from '@/view-models/pharmacy-duplicate-compare'
import type { PharmacyFormSource } from '@/view-models/pharmacy-form'

const base: PharmacyFormSource = {
  name: 'Pharmacie Bellecour',
  siret: '12345678900012',
  numeroTVA: null,
  address: '1 rue Test',
  city: 'Lyon',
  postalCode: '69002',
  phone: null,
  email: null,
  website: null,
  status: 'PROSPECT',
  groupementId: null,
  softwareId: null,
}

describe('toPharmacyDuplicateRowFromFormSource', () => {
  it('does not throw when existing pharmacy email is invalid junk', () => {
    expect(() =>
      toPharmacyDuplicateRowFromFormSource({ ...base, email: 'N/A' }),
    ).not.toThrow()
    const row = toPharmacyDuplicateRowFromFormSource({ ...base, email: 'N/A' })
    expect(row.name).toBe('Pharmacie Bellecour')
    expect(row.siret).toBe('12345678900012')
  })
})
