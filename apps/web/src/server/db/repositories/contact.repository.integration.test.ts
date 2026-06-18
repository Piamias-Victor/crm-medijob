// @vitest-environment node
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { startTestDb, type TestDb } from '../../../../test/db'
import { makeContactRepository } from './contact.repository'

let db: TestDb
let repo: ReturnType<typeof makeContactRepository>
let pharmacyId: string

beforeAll(async () => {
  db = await startTestDb()
  repo = makeContactRepository(db.prisma)
  const pharmacy = await db.prisma.pharmacy.create({ data: { name: 'Pharma' } })
  pharmacyId = pharmacy.id
}, 120_000)

afterAll(async () => {
  await db?.stop()
})

function newContact(firstName: string) {
  return { firstName, lastName: 'Doe', pharmacy: { connect: { id: pharmacyId } } }
}

describe('contactRepository', () => {
  it('creates and lists a contact by pharmacy', async () => {
    const created = await repo.create(newContact('Anne'))
    const byPharmacy = await repo.listByPharmacy(pharmacyId)
    expect(byPharmacy.some((c) => c.id === created.id)).toBe(true)
  })

  it('hides soft-deleted contacts from reads', async () => {
    const c = await repo.create(newContact('Marc'))
    await repo.softDelete(c.id)
    expect(await repo.findById(c.id)).toBeNull()
    expect((await repo.list()).some((x) => x.id === c.id)).toBe(false)
  })
})
