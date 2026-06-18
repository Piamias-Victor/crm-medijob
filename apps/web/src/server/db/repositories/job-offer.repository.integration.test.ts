// @vitest-environment node
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { startTestDb, type TestDb } from '../../../../test/db'
import { makeJobOfferRepository } from './job-offer.repository'

let db: TestDb
let repo: ReturnType<typeof makeJobOfferRepository>

async function newMissionId() {
  const pharmacy = await db.prisma.pharmacy.create({ data: { name: 'Pharma' } })
  const referent = await db.prisma.user.create({
    data: { email: `o${Date.now()}@medijob.fr`, password: 'x', name: 'Réf' },
  })
  const jobTitle = await db.prisma.jobTitle.create({
    data: { name: `Métier ${Date.now()}` },
  })
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
  return mission.id
}

beforeAll(async () => {
  db = await startTestDb()
  repo = makeJobOfferRepository(db.prisma)
}, 120_000)

afterAll(async () => {
  await db?.stop()
})

describe('jobOfferRepository', () => {
  it('creates and finds an offer', async () => {
    const missionId = await newMissionId()
    const created = await repo.create({
      title: 'Offre',
      content: 'markdown',
      mission: { connect: { id: missionId } },
    })
    expect((await repo.findById(created.id))?.title).toBe('Offre')
  })

  it('hides soft-deleted offers from reads', async () => {
    const missionId = await newMissionId()
    const o = await repo.create({
      title: 'Offre 2',
      content: 'md',
      mission: { connect: { id: missionId } },
    })
    await repo.softDelete(o.id)
    expect(await repo.findById(o.id)).toBeNull()
    expect((await repo.list()).some((x) => x.id === o.id)).toBe(false)
  })
})
