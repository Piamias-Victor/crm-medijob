// @vitest-environment node
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { startTestDb, type TestDb } from '../../../../test/db'
import { makeCandidateRepository } from './candidate.repository'

let db: TestDb
let repo: ReturnType<typeof makeCandidateRepository>
let jobTitleId: string
let referentId: string

beforeAll(async () => {
  db = await startTestDb()
  repo = makeCandidateRepository(db.prisma)
  const jobTitle = await db.prisma.jobTitle.create({ data: { name: 'Pharmacien' } })
  const referent = await db.prisma.user.create({
    data: { email: 'r@medijob.fr', password: 'x', name: 'Réf' },
  })
  jobTitleId = jobTitle.id
  referentId = referent.id
}, 120_000)

afterAll(async () => {
  await db?.stop()
})

function newCandidate(firstName: string) {
  return {
    firstName,
    lastName: 'Test',
    jobTitle: { connect: { id: jobTitleId } },
    referent: { connect: { id: referentId } },
  }
}

describe('candidateRepository', () => {
  it('creates and finds a candidate by id', async () => {
    const created = await repo.create(newCandidate('Alice'))
    const found = await repo.findById(created.id)
    expect(found?.firstName).toBe('Alice')
  })

  it('lists only non-deleted candidates', async () => {
    const c = await repo.create(newCandidate('Bob'))
    await repo.softDelete(c.id)
    const list = await repo.list()
    expect(list.some((x) => x.id === c.id)).toBe(false)
    expect(await repo.findById(c.id)).toBeNull()
  })

  it('searches by name, case-insensitive, excluding deleted', async () => {
    const keep = await repo.create(newCandidate('Charlotte'))
    const gone = await repo.create(newCandidate('Charline'))
    await repo.softDelete(gone.id)

    const results = await repo.search('charl')

    expect(results.some((x) => x.id === keep.id)).toBe(true)
    expect(results.some((x) => x.id === gone.id)).toBe(false)
  })
})
