// @vitest-environment node
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { startTestDb, type TestDb } from '../../../../test/db'
import { makeMissionCandidateRepository } from './mission-candidate.repository'

let db: TestDb
let repo: ReturnType<typeof makeMissionCandidateRepository>
let missionId: string
let deletedCandidateId: string
let nouveauId: string

beforeAll(async () => {
  db = await startTestDb()
  repo = makeMissionCandidateRepository(db.prisma)
  const jobTitle = await db.prisma.jobTitle.create({ data: { name: 'Pharmacien' } })
  const referent = await db.prisma.user.create({
    data: { email: 'mc-pos@medijob.fr', password: 'x', name: 'Réf' },
  })
  const pharmacy = await db.prisma.pharmacy.create({ data: { name: 'Pharma' } })
  const mission = await db.prisma.mission.create({
    data: {
      title: 'CDD',
      contractType: 'CDD',
      startDate: new Date(),
      pharmacyId: pharmacy.id,
      referentId: referent.id,
      jobTitleId: jobTitle.id,
    },
  })
  const deletedCandidate = await db.prisma.candidate.create({
    data: {
      firstName: 'Deleted',
      lastName: 'User',
      jobTitleId: jobTitle.id,
      referentId: referent.id,
      deletedAt: new Date(),
    },
  })
  const stage = await db.prisma.pipelineStage.create({ data: { name: 'Nouveau', position: 0 } })
  missionId = mission.id
  deletedCandidateId = deletedCandidate.id
  nouveauId = stage.id
}, 120_000)

afterAll(async () => {
  await db?.stop()
})

describe('missionCandidateRepository positioning', () => {
  it('creates a MissionCandidate at the default Nouveau stage', async () => {
    const candidate = await db.prisma.candidate.create({
      data: {
        firstName: 'Bob',
        lastName: 'Durand',
        jobTitleId: (await db.prisma.jobTitle.findFirst())!.id,
        referentId: (await db.prisma.user.findFirst())!.id,
      },
    })
    const created = await repo.createAtDefaultStage({ missionId, candidateId: candidate.id })
    expect(created).toMatchObject({ missionId, candidateId: candidate.id, stageId: nouveauId })
  })

  it('refuses soft-deleted candidates when positioning', async () => {
    const result = await repo.createAtDefaultStage({
      missionId,
      candidateId: deletedCandidateId,
    })
    expect(result).toBeNull()
  })

  it('removes a candidate from a mission', async () => {
    const candidate = await db.prisma.candidate.create({
      data: {
        firstName: 'Chloe',
        lastName: 'Petit',
        jobTitleId: (await db.prisma.jobTitle.findFirst())!.id,
        referentId: (await db.prisma.user.findFirst())!.id,
      },
    })
    await repo.createAtDefaultStage({ missionId, candidateId: candidate.id })
    await repo.remove({ missionId, candidateId: candidate.id })
    const row = await db.prisma.missionCandidate.findUnique({
      where: { missionId_candidateId: { missionId, candidateId: candidate.id } },
    })
    expect(row).toBeNull()
  })
})
