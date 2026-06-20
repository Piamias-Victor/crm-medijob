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
  return { firstName, lastName: 'Doe', pharmacyId }
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

  it('unsets previous primary when creating a primary contact', async () => {
    const first = await repo.create({ ...newContact('Anne'), isPrimary: true })
    const second = await repo.create({ ...newContact('Bob'), isPrimary: true })
    const contacts = await repo.listByPharmacy(pharmacyId)
    expect(contacts.find((c) => c.id === first.id)?.isPrimary).toBe(false)
    expect(contacts.find((c) => c.id === second.id)?.isPrimary).toBe(true)
  })

  it('unsets previous primary when setting a new one', async () => {
    const first = await repo.create({ ...newContact('Anne'), isPrimary: true })
    const second = await repo.create({ ...newContact('Bob'), isPrimary: false })
    await repo.setPrimary(second.id)
    const contacts = await repo.listByPharmacy(pharmacyId)
    expect(contacts.find((c) => c.id === first.id)?.isPrimary).toBe(false)
    expect(contacts.find((c) => c.id === second.id)?.isPrimary).toBe(true)
  })

  it('list respects take limit', async () => {
    for (let i = 0; i < 3; i++) await repo.create(newContact(`Limit${i}`))
    expect((await repo.list(2)).length).toBe(2)
  })

  it('listByPharmacy respects take limit', async () => {
    for (let i = 0; i < 3; i++) await repo.create(newContact(`Pharm${i}`))
    expect((await repo.listByPharmacy(pharmacyId, 2)).length).toBe(2)
  })
})
