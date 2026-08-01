// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { makeDeps, pharmacyCaller } from '@/server/routers/pharmacy.test.deps'

describe('pharmacyRouter referent', () => {
  it('crée une pharmacie sans référent (referentId null)', async () => {
    const deps = makeDeps()
    await pharmacyCaller(deps).create({ name: 'Sans ref', referentId: null })
    expect(deps.pharmacies.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Sans ref', referentId: null }),
    )
  })

  it('expose les recruiters dans referentials', async () => {
    const refs = await pharmacyCaller(makeDeps()).referentials()
    expect(refs.recruiters).toEqual([{ id: 'u1', name: 'Recruteur' }])
  })
})
