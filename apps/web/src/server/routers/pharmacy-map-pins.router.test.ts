import { describe, it, expect } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makePharmacyRouter } from '@/server/routers/pharmacy'
import { makeDeps, pharmacyCaller } from '@/server/routers/pharmacy.test.deps'

describe('pharmacyRouter.mapPins', () => {
  it('returns lean geolocated pins', async () => {
    const pins = await pharmacyCaller(makeDeps()).mapPins()
    expect(pins).toEqual([
      { id: 'p1', label: 'Pharma Test', latitude: 45.7, longitude: 4.8 },
    ])
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makePharmacyRouter(makeDeps()))({ session: null })
    await expect(unauth.mapPins()).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
  })
})
