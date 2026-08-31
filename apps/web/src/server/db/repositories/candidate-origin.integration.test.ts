// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { startTestDb, type TestDb } from '../../../../test/db'
import { makeCandidateRepository } from './candidate.repository'

let db: TestDb
let repo: ReturnType<typeof makeCandidateRepository>
let jobTitleId: string

beforeAll(async () => {
  db = await startTestDb()
  repo = makeCandidateRepository(db.prisma)
  const jobTitle = await db.prisma.jobTitle.create({ data: { name: 'Pharmacien' } })
  jobTitleId = jobTitle.id
}, 120_000)

afterAll(async () => {
  await db?.stop()
})

function newCandidate(firstName: string) {
  return {
    firstName,
    lastName: 'Test',
    jobTitle: { connect: { id: jobTitleId } },
  }
}

describe('candidate origin App', () => {
  it('defaults origin CRM and stores unique nullable badakanId', async () => {
    const crm = await repo.create(newCandidate('Paul'))
    expect(crm.origin).toBe('CRM')
    expect(crm.badakanId).toBeNull()

    const app = await repo.create({
      ...newCandidate('Marie'),
      origin: 'APP',
      badakanId: 'bk-marie',
    })
    expect(app.origin).toBe('APP')
    expect(app.badakanId).toBe('bk-marie')

    await repo.create(newCandidate('Clara'))
    await expect(
      repo.create({ ...newCandidate('Clone'), badakanId: 'bk-marie' }),
    ).rejects.toMatchObject({ code: 'P2002' })
  })
})
