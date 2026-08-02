// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { resolveGeocodeForWrite } from '@/lib/geo/resolve-geocode-for-write'

const fields = { address: '1 rue A', city: 'Lyon', postalCode: '69001' }

describe('resolveGeocodeForWrite', () => {
  it('geocodes on create when address present', async () => {
    const lookup = vi.fn().mockResolvedValue({ lat: 45.75, lon: 4.85 })
    await expect(resolveGeocodeForWrite(fields, null, lookup)).resolves.toEqual({
      latitude: 45.75,
      longitude: 4.85,
    })
  })

  it('skips lookup when address unchanged on update', async () => {
    const lookup = vi.fn()
    await expect(resolveGeocodeForWrite(fields, fields, lookup)).resolves.toBeUndefined()
    expect(lookup).not.toHaveBeenCalled()
  })

  it('clears coords when address emptied', async () => {
    const lookup = vi.fn()
    const empty = { address: null, city: null, postalCode: null }
    await expect(resolveGeocodeForWrite(empty, fields, lookup)).resolves.toEqual({
      latitude: null,
      longitude: null,
    })
  })

  it('sets null when geocode fails after address change', async () => {
    const lookup = vi.fn().mockResolvedValue(null)
    const next = { ...fields, address: '2 rue B' }
    await expect(resolveGeocodeForWrite(next, fields, lookup)).resolves.toEqual({
      latitude: null,
      longitude: null,
    })
  })
})
