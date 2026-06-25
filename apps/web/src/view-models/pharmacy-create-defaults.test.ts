import { describe, expect, it } from 'vitest'
import { buildPharmacyCreateDefaults } from '@/view-models/pharmacy-create-defaults'

describe('buildPharmacyCreateDefaults', () => {
  it('returns empty identity fields with PROSPECT status', () => {
    expect(buildPharmacyCreateDefaults()).toEqual({
      name: '',
      status: 'PROSPECT',
    })
  })
})
