// @vitest-environment node
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { startTestDb, type TestDb } from '../../../../test/db'
import { makeContactRepository } from './contact.repository'

let db: TestDb
let repo: ReturnType<typeof makeContactRepository>
let pharmacyId: string
let contactRoleId: string

beforeAll(async () => {
  db = await startTestDb()
  repo = makeContactRepository(db.prisma)
  const [pharmacy, role] = await Promise.all([
    db.prisma.pharmacy.create({ data: { name: 'Pharma' } }),
    db.prisma.contactRole.create({ data: { name: 'Titulaire' } }),
  ])
  pharmacyId = pharmacy.id
  contactRoleId = role.id
}, 120_000)

afterAll(async () => {
  await db?.stop()
})

function newContact(firstName: string) {
  return {
    firstName,
    lastName: 'Doe',
    pharmacyId,
    contactRoleId,
    email: `${firstName.toLowerCase()}@example.com`,
  }
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
    expect((await repo.list(undefined, 2)).length).toBe(2)
  })

  it('listByPharmacy respects take limit', async () => {
    for (let i = 0; i < 3; i++) await repo.create(newContact(`Pharm${i}`))
    expect((await repo.listByPharmacy(pharmacyId, 2)).length).toBe(2)
  })

  it('findPrimaryByPharmacy can exclude the current contact', async () => {
    const pharmacy = await db.prisma.pharmacy.create({ data: { name: 'Primary lookup pharma' } })
    const primary = await repo.create({
      ...newContact('Claire'),
      pharmacyId: pharmacy.id,
      isPrimary: true,
    })
    const other = await repo.create({
      ...newContact('Denis'),
      pharmacyId: pharmacy.id,
      isPrimary: false,
    })
    expect(await repo.findPrimaryByPharmacy(pharmacy.id)).toMatchObject({ firstName: 'Claire' })
    expect(await repo.findPrimaryByPharmacy(pharmacy.id, other.id)).toMatchObject({ firstName: 'Claire' })
    expect(await repo.findPrimaryByPharmacy(pharmacy.id, primary.id)).toBeNull()
  })
})
