// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makePharmacyRouter } from '@/server/routers/pharmacy'
import { makeDeps, pharmacyCaller, recruteurSession } from '@/server/routers/pharmacy.test.deps'

describe('pharmacyRouter', () => {
  it('returns list rows mapped to SPEC columns', async () => {
    const rows = await pharmacyCaller(makeDeps()).list()
    expect(rows[0]).toMatchObject({ name: 'Pharmacie du Centre', groupementName: 'Giphar', missionCount: 2 })
  })

  it('returns enriched pharmacy detail by id', async () => {
    const detail = await pharmacyCaller(makeDeps()).getById({ id: 'p1' })
    expect(detail?.primaryContactName).toBe('Marie Curie')
    expect(detail?.activeMissions).toHaveLength(1)
  })

  it('persists cleared optional fields as null on update', async () => {
    const deps = makeDeps()
    await pharmacyCaller(deps).update({ id: 'p1', data: { name: 'Pharmacie', status: 'ACTIF', phone: '' } })
    expect(deps.pharmacies.update).toHaveBeenCalledWith('p1', expect.objectContaining({ phone: null }))
  })

  it('computes numeroTVA from the SIRET on create', async () => {
    const deps = makeDeps()
    await pharmacyCaller(deps).create({ name: 'Test', siret: '00000000100012' })
    expect(deps.pharmacies.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Test', numeroTVA: 'FR15000000001' }),
    )
  })

  it('delegates SIRET search to the service', async () => {
    const deps = makeDeps()
    const res = await pharmacyCaller(deps).searchSiret({ query: 'pharmacie' })
    expect(deps.searchSiret).toHaveBeenCalledWith('pharmacie')
    expect(res[0].siret).toBe('1')
  })

  it('soft deletes by id', async () => {
    const deps = makeDeps()
    await pharmacyCaller(deps).softDelete({ id: 'p1' })
    expect(deps.pharmacies.softDelete).toHaveBeenCalledWith('p1')
  })

  it('creates a groupement referential for recruiters', async () => {
    const deps = makeDeps()
    const created = await pharmacyCaller(deps).createGroupement({ name: 'Giphar' })
    expect(deps.createGroupement).toHaveBeenCalledWith('Giphar')
    expect(created).toEqual({ id: 'g1', name: 'Giphar' })
  })

  it('creates a software referential for recruiters', async () => {
    const deps = makeDeps()
    const created = await pharmacyCaller(deps).createSoftware({ name: 'Winpharma' })
    expect(deps.createSoftware).toHaveBeenCalledWith('Winpharma')
    expect(created).toEqual({ id: 's1', name: 'Winpharma' })
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makePharmacyRouter(makeDeps()))({ session: null })
    await expect(unauth.list()).rejects.toThrow()
  })
})
