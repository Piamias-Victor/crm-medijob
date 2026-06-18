// @vitest-environment node
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { startTestDb, type TestDb } from '../../../../test/db'
import { makeMissionCandidateRepository } from './mission-candidate.repository'

let db: TestDb
let repo: ReturnType<typeof makeMissionCandidateRepository>
let missionId: string
let candidateId: string
let stageA: string
let stageB: string

beforeAll(async () => {
  db = await startTestDb()
  repo = makeMissionCandidateRepository(db.prisma)
  const jobTitle = await db.prisma.jobTitle.create({ data: { name: 'Pharmacien' } })
  const referent = await db.prisma.user.create({
    data: { email: 'mc@medijob.fr', password: 'x', name: 'Réf' },
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
  const candidate = await db.prisma.candidate.create({
    data: {
      firstName: 'Alice',
      lastName: 'Martin',
      jobTitleId: jobTitle.id,
      referentId: referent.id,
    },
  })
  const stages = await db.prisma.pipelineStage.createManyAndReturn({
    data: [
      { name: 'Nouveau', position: 0 },
      { name: 'Contacté', position: 1 },
    ],
  })
  await db.prisma.missionCandidate.create({
    data: {
      missionId: mission.id,
      candidateId: candidate.id,
      stageId: stages[0].id,
    },
  })
  missionId = mission.id
  candidateId = candidate.id
  stageA = stages[0].id
  stageB = stages[1].id
}, 120_000)

afterAll(async () => {
  await db?.stop()
})

describe('missionCandidateRepository', () => {
  it('updates the PipelineStage on a MissionCandidate', async () => {
    const updated = await repo.updateStage({
      missionId,
      candidateId,
      stageId: stageB,
    })
    expect(updated.stageId).toBe(stageB)

    const row = await db.prisma.missionCandidate.findUnique({
      where: { missionId_candidateId: { missionId, candidateId } },
    })
    expect(row?.stageId).toBe(stageB)
    expect(row?.stageId).not.toBe(stageA)
  })
})
