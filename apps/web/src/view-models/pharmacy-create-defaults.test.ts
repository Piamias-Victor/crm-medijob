import { describe, expect, it } from 'vitest'
import { buildPharmacyCreateDefaults } from '@/view-models/pharmacy-create-defaults'

describe('buildPharmacyCreateDefaults', () => {
  it('returns empty identity fields with PROSPECT status and optional referent', () => {
    expect(buildPharmacyCreateDefaults('u1')).toEqual({
      name: '',
      status: 'PROSPECT',
      referentId: 'u1',
    })
    expect(buildPharmacyCreateDefaults().referentId).toBeNull()
  })
})
