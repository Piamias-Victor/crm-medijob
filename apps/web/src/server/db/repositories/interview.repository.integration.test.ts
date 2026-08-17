// @vitest-environment node
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { startTestDb, type TestDb } from '../../../../test/db'
import { makeInterviewRepository } from './interview.repository'

let db: TestDb
let repo: ReturnType<typeof makeInterviewRepository>
let candidateId: string
let otherCandidateId: string
let referentId: string

beforeAll(async () => {
  db = await startTestDb()
  repo = makeInterviewRepository(db.prisma)
  const jobTitle = await db.prisma.jobTitle.create({ data: { name: 'Pharmacien' } })
  const referent = await db.prisma.user.create({
    data: { email: 'ref@medijob.fr', password: 'x', name: 'Réf' },
  })
  referentId = referent.id
  const candidate = await db.prisma.candidate.create({
    data: { firstName: 'Alice', lastName: 'Test', jobTitleId: jobTitle.id },
  })
  const other = await db.prisma.candidate.create({
    data: { firstName: 'Bob', lastName: 'Test', jobTitleId: jobTitle.id },
  })
  candidateId = candidate.id
  otherCandidateId = other.id
}, 120_000)

afterAll(async () => {
  await db?.stop()
})

describe('interviewRepository', () => {
  it('persists an interview and lists it for the candidate', async () => {
    const created = await repo.create({
      candidateId,
      mode: 'INTERIM',
      referentId,
    })
    const list = await repo.listByCandidate(candidateId)
    expect(list.some((row) => row.id === created.id)).toBe(true)
    expect(list[0]?.status).toBe('DRAFT')
    expect(list[0]?.mode).toBe('INTERIM')
  })

  it('does not list another candidate interviews', async () => {
    await repo.create({ candidateId, mode: 'CDD_CDI' })
    expect(await repo.listByCandidate(otherCandidateId)).toEqual([])
  })

  it('finds a persisted interview by id', async () => {
    const created = await repo.create({ candidateId, mode: 'INTERIM' })
    expect((await repo.findById(created.id))?.id).toBe(created.id)
  })
})
