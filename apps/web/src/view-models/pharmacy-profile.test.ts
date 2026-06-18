import { describe, it, expect } from 'vitest'
import { getMissingPharmacyFields } from '@/view-models/pharmacy-profile'

describe('getMissingPharmacyFields', () => {
  it('flags missing city and postal code', () => {
    expect(getMissingPharmacyFields({ city: '', postalCode: null })).toEqual(['city', 'postalCode'])
  })

  it('returns empty when location is complete', () => {
    expect(getMissingPharmacyFields({ city: 'Lyon', postalCode: '69001' })).toEqual([])
  })
})
