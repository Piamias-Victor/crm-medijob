import { describe, it, expect } from 'vitest'
import { toPharmacyUpdateData } from '@/view-models/pharmacy-update'

describe('toPharmacyUpdateData', () => {
  it('clears optional fields as null when removed from the form', () => {
    const update = toPharmacyUpdateData({
      name: 'Pharmacie',
      status: 'ACTIF',
      siret: undefined,
      city: undefined,
      phone: undefined,
    })
    expect(update.siret).toBeNull()
    expect(update.city).toBeNull()
    expect(update.phone).toBeNull()
  })
})
