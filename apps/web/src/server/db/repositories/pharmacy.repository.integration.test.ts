// @vitest-environment node
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { startTestDb, type TestDb } from '../../../../test/db'
import { makePharmacyRepository } from './pharmacy.repository'

let db: TestDb
let repo: ReturnType<typeof makePharmacyRepository>

beforeAll(async () => {
  db = await startTestDb()
  repo = makePharmacyRepository(db.prisma)
}, 120_000)

afterAll(async () => {
  await db?.stop()
})

describe('pharmacyRepository', () => {
  it('creates and finds a pharmacy', async () => {
    const created = await repo.create({ name: 'Pharmacie du Centre' })
    expect((await repo.findById(created.id))?.name).toBe('Pharmacie du Centre')
  })

  it('hides soft-deleted pharmacies from reads', async () => {
    const p = await repo.create({ name: 'Pharmacie Gare' })
    await repo.softDelete(p.id)
    expect(await repo.findById(p.id)).toBeNull()
    expect((await repo.list()).some((x) => x.id === p.id)).toBe(false)
  })

  it('updates editable fields', async () => {
    const p = await repo.create({ name: 'Pharmacie Lac', status: 'PROSPECT' })
    await repo.update(p.id, { status: 'ACTIF', city: 'Lyon' })
    const updated = await repo.findById(p.id)
    expect(updated?.status).toBe('ACTIF')
    expect(updated?.city).toBe('Lyon')
  })

  it('exposes groupement, contacts and mission count in the list', async () => {
    const p = await repo.create({ name: 'Pharmacie Forum' })
    const [row] = (await repo.list()).filter((x) => x.id === p.id)
    expect(row).toMatchObject({ contacts: [], _count: { missions: 0 } })
    expect(row.groupement).toBeNull()
  })
})
