import { describe, it, expect, vi } from 'vitest'
import {
  createAddressLookup,
  createCommuneCityLookup,
  createCommunePostalLookup,
  isFrenchPostalCode,
} from '@/lib/geo/gouv-coords'

const hyeres = { centre: { coordinates: [6.2357, 43.1139] } }

describe('gouv coords lookup', () => {
  it('validates french postal codes', () => {
    expect(isFrenchPostalCode('83400')).toBe(true)
    expect(isFrenchPostalCode('40')).toBe(false)
  })

  it('resolves commune by postal code', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [hyeres],
    })
    const lookup = createCommunePostalLookup(fetchFn)
    await expect(lookup('83400')).resolves.toEqual({ lon: 6.2357, lat: 43.1139 })
  })

  it('resolves address query', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ features: [{ geometry: { coordinates: [6.136395, 43.116177] } }] }),
    })
    const lookup = createAddressLookup(fetchFn)
    await expect(lookup('53 rue soldat Ferrari 83400')).resolves.toEqual({
      lon: 6.136395,
      lat: 43.116177,
    })
  })

  it('resolves commune by city name', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [hyeres],
    })
    const lookup = createCommuneCityLookup(fetchFn)
    await expect(lookup('Hyères')).resolves.toEqual({ lon: 6.2357, lat: 43.1139 })
  })
})
