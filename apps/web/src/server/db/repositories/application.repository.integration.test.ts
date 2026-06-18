// @vitest-environment node
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { startTestDb, type TestDb } from '../../../../test/db'
import { makeApplicationRepository } from './application.repository'

let db: TestDb
let repo: ReturnType<typeof makeApplicationRepository>
let jobOfferId: string

beforeAll(async () => {
  db = await startTestDb()
  repo = makeApplicationRepository(db.prisma)
  const pharmacy = await db.prisma.pharmacy.create({ data: { name: 'Pharma' } })
  const referent = await db.prisma.user.create({
    data: { email: 'a@medijob.fr', password: 'x', name: 'Réf' },
  })
  const jobTitle = await db.prisma.jobTitle.create({ data: { name: 'Pharmacien' } })
  const mission = await db.prisma.mission.create({
    data: {
      title: 'M',
      contractType: 'CDI',
      startDate: new Date(),
      pharmacyId: pharmacy.id,
      referentId: referent.id,
      jobTitleId: jobTitle.id,
    },
  })
  const offer = await db.prisma.jobOffer.create({
    data: { title: 'O', content: 'md', missionId: mission.id },
  })
  jobOfferId = offer.id
}, 120_000)

afterAll(async () => {
  await db?.stop()
})

function newApplication(firstName: string) {
  return {
    firstName,
    lastName: 'Web',
    email: `${firstName}@site.fr`,
    jobOffer: { connect: { id: jobOfferId } },
  }
}

describe('applicationRepository', () => {
  it('creates and finds an application', async () => {
    const created = await repo.create(newApplication('Lea'))
    expect((await repo.findById(created.id))?.firstName).toBe('Lea')
  })

  it('hides soft-deleted applications from reads', async () => {
    const a = await repo.create(newApplication('Tom'))
    await repo.softDelete(a.id)
    expect(await repo.findById(a.id)).toBeNull()
    expect((await repo.list()).some((x) => x.id === a.id)).toBe(false)
  })
})
