import { describe, it, expect, vi, beforeEach } from 'vitest'
import { lookupCityByPostalCode, lookupPostalCodeByCity } from '@/lib/geo-fr'

describe('geo-fr lookup', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('resolves a city from a valid postal code', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ nom: 'Lyon' }],
      }),
    )
    await expect(lookupCityByPostalCode('69001')).resolves.toBe('Lyon')
  })

  it('resolves a postal code from a city name', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ codesPostaux: ['69001', '69002'] }],
      }),
    )
    await expect(lookupPostalCodeByCity('Lyon')).resolves.toBe('69001')
  })

  it('returns null when the API finds nothing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => [] }),
    )
    await expect(lookupCityByPostalCode('00000')).resolves.toBeNull()
  })
})
