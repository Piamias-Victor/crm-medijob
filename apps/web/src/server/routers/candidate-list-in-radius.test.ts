// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { handleListPharmaciesInRadius } from '@/server/routers/candidate-list-in-radius'
import { clearRadiusListCache } from '@/server/routers/candidate-list-in-radius-cache'
import { makeListInRadiusDeps } from '@/server/routers/candidate-list-in-radius.test.fixtures'

describe('handleListPharmaciesInRadius', () => {
  beforeEach(() => {
    clearRadiusListCache()
  })

  it('returns pharmacies within radius with resolvable email only', async () => {
    const deps = makeListInRadiusDeps()
    const result = await handleListPharmaciesInRadius(deps, {
      candidateId: 'c1',
      radiusKm: 15,
    })

    expect(result.pharmacies).toHaveLength(1)
    expect(result.pharmacies[0]).toMatchObject({
      id: 'p-near',
      email: 'titulaire@example.com',
      contactId: 'ct1',
    })
    expect(result.pharmacies[0]!.distanceKm).toBeLessThanOrEqual(15)
    expect(result.centerLabel).toContain('Lyon')
    expect(deps.listPharmaciesForRadius).toHaveBeenCalledWith('69')
  })

  it('reuses cached list for identical candidate and radius', async () => {
    const deps = makeListInRadiusDeps()
    await handleListPharmaciesInRadius(deps, { candidateId: 'c1', radiusKm: 15 })
    await handleListPharmaciesInRadius(deps, { candidateId: 'c1', radiusKm: 15 })
    expect(deps.listPharmaciesForRadius).toHaveBeenCalledTimes(1)
  })

  it('rejects when candidate location cannot be geocoded', async () => {
    const deps = makeListInRadiusDeps({
      findCandidateGeo: vi.fn().mockResolvedValue({ postalCode: null, address: null, city: null }),
    })

    await expect(
      handleListPharmaciesInRadius(deps, { candidateId: 'c1', radiusKm: 15 }),
    ).rejects.toMatchObject({
      message: 'Localisation candidat insuffisante pour calculer le périmètre.',
    })
  })
})
