// @vitest-environment node
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { startTestDb, type TestDb } from '../../../../test/db'
import { makeMissionRepository } from './mission.repository'

let db: TestDb
let repo: ReturnType<typeof makeMissionRepository>
let pharmacyId: string
let referentId: string
let jobTitleId: string

beforeAll(async () => {
  db = await startTestDb()
  repo = makeMissionRepository(db.prisma)
  const pharmacy = await db.prisma.pharmacy.create({ data: { name: 'Pharma' } })
  const referent = await db.prisma.user.create({
    data: { email: 'm@medijob.fr', password: 'x', name: 'Réf' },
  })
  const jobTitle = await db.prisma.jobTitle.create({ data: { name: 'Pharmacien' } })
  pharmacyId = pharmacy.id
  referentId = referent.id
  jobTitleId = jobTitle.id
}, 120_000)

afterAll(async () => {
  await db?.stop()
})

function newMission(title: string) {
  return {
    title,
    contractType: 'CDI' as const,
    startDate: new Date(),
    pharmacy: { connect: { id: pharmacyId } },
    referent: { connect: { id: referentId } },
    jobTitle: { connect: { id: jobTitleId } },
  }
}

describe('missionRepository', () => {
  it('creates and finds a mission', async () => {
    const created = await repo.create(newMission('Remplacement été'))
    expect((await repo.findById(created.id))?.title).toBe('Remplacement été')
  })

  it('hides soft-deleted missions from reads', async () => {
    const m = await repo.create(newMission('CDD week-end'))
    await repo.softDelete(m.id)
    expect(await repo.findById(m.id)).toBeNull()
    expect((await repo.list()).some((x) => x.id === m.id)).toBe(false)
  })
})
