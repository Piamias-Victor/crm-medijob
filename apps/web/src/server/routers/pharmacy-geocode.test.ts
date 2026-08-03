// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { makeDeps, pharmacyCaller } from '@/server/routers/pharmacy.test.deps'

describe('pharmacyRouter geocode on write', () => {
  it('persists lat/lng on create when address present', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'new' })
    const lookupGeo = vi.fn().mockResolvedValue({ lat: 45.75, lon: 4.85 })
    const deps = makeDeps({
      pharmacies: { ...makeDeps().pharmacies, create },
      lookupGeo,
    })
    await pharmacyCaller(deps).create({
      name: 'Pharma',
      address: '1 rue A',
      city: 'Lyon',
      postalCode: '69001',
      status: 'PROSPECT',
    })
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ latitude: 45.75, longitude: 4.85 }),
    )
  })

  it('skips geocode when address unchanged on update', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'p1' })
    const lookupGeo = vi.fn()
    const deps = makeDeps({
      pharmacies: {
        ...makeDeps().pharmacies,
        update,
        findAddressById: vi.fn().mockResolvedValue({
          address: '1 rue A',
          city: 'Lyon',
          postalCode: '69001',
        }),
      },
      lookupGeo,
    })
    await pharmacyCaller(deps).update({
      id: 'p1',
      data: {
        name: 'Pharma',
        address: '1 rue A',
        city: 'Lyon',
        postalCode: '69001',
        status: 'ACTIF',
      },
    })
    expect(lookupGeo).not.toHaveBeenCalled()
    expect(update).toHaveBeenCalledWith(
      'p1',
      expect.not.objectContaining({ latitude: expect.anything() }),
    )
  })
})
