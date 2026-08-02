// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import {
  buildGeocodeQuery,
  geocodeAddressFields,
  addressFieldsChanged,
} from '@/lib/geo/geocode-address-fields'

describe('geocodeAddressFields', () => {
  it('returns lat/lng for valid French address', async () => {
    const lookup = vi.fn().mockResolvedValue({ lat: 43.116, lon: 6.136 })
    const result = await geocodeAddressFields(
      { address: '53 rue Ferrari', city: 'Hyères', postalCode: '83400' },
      lookup,
    )
    expect(result).toEqual({ latitude: 43.116, longitude: 6.136 })
    expect(lookup).toHaveBeenCalledWith('53 rue Ferrari 83400 Hyères')
  })

  it('returns null when address fields empty', async () => {
    const lookup = vi.fn()
    await expect(
      geocodeAddressFields({ address: null, city: null, postalCode: null }, lookup),
    ).resolves.toBeNull()
    expect(lookup).not.toHaveBeenCalled()
  })

  it('returns null when lookup fails', async () => {
    const lookup = vi.fn().mockResolvedValue(null)
    await expect(
      geocodeAddressFields({ address: null, city: 'Nowhere', postalCode: null }, lookup),
    ).resolves.toBeNull()
  })
})

describe('buildGeocodeQuery', () => {
  it('joins non-empty parts', () => {
    expect(buildGeocodeQuery({ address: ' 1 rue A ', city: 'Lyon', postalCode: '69001' })).toBe(
      '1 rue A 69001 Lyon',
    )
  })
})

describe('addressFieldsChanged', () => {
  it('detects address change', () => {
    expect(
      addressFieldsChanged(
        { address: 'A', city: 'Lyon', postalCode: '69001' },
        { address: 'B', city: 'Lyon', postalCode: '69001' },
      ),
    ).toBe(true)
  })

  it('ignores unchanged fields', () => {
    const fields = { address: 'A', city: 'Lyon', postalCode: '69001' }
    expect(addressFieldsChanged(fields, fields)).toBe(false)
  })
})
