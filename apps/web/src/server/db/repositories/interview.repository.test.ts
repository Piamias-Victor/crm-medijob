import { describe, expect, it, vi } from 'vitest'
import { makeInterviewRepository } from './interview.repository'

type Row = {
  id: string
  candidateId: string
  mode: string
  status: string
  deletedAt: Date | null
  createdAt: Date
}

function fakeDb(rows: Row[] = []) {
  return {
    interview: {
      create: vi.fn(async ({ data }: { data: Partial<Row> }) => {
        const row: Row = {
          id: `i-${rows.length + 1}`,
          status: 'DRAFT',
          deletedAt: null,
          createdAt: new Date(),
          candidateId: String(data.candidateId),
          mode: String(data.mode),
        }
        rows.push(row)
        return row
      }),
      findMany: vi.fn(async ({ where }: { where: { candidateId: string; deletedAt: Date | null } }) =>
        rows.filter((row) => row.candidateId === where.candidateId && row.deletedAt === where.deletedAt),
      ),
      findFirst: vi.fn(async ({ where }: { where: { id: string; deletedAt: Date | null } }) =>
        rows.find((row) => row.id === where.id && row.deletedAt === where.deletedAt) ?? null,
      ),
    },
  }
}

describe('interviewRepository', () => {
  it('persists an interview and lists it for the candidate', async () => {
    const db = fakeDb()
    const repo = makeInterviewRepository(db as never)
    const created = await repo.create({ candidateId: 'c1', mode: 'INTERIM' })
    const list = await repo.listByCandidate('c1')
    expect(list.some((row) => row.id === created.id)).toBe(true)
    expect(list[0]?.status).toBe('DRAFT')
    expect(list[0]?.mode).toBe('INTERIM')
  })

  it('does not list interviews of another candidate', async () => {
    const db = fakeDb()
    const repo = makeInterviewRepository(db as never)
    await repo.create({ candidateId: 'c1', mode: 'INTERIM' })
    expect(await repo.listByCandidate('c2')).toEqual([])
  })

  it('finds a persisted interview by id', async () => {
    const db = fakeDb()
    const repo = makeInterviewRepository(db as never)
    const created = await repo.create({ candidateId: 'c1', mode: 'CDD_CDI' })
    const found = await repo.findById(created.id)
    expect(found?.mode).toBe('CDD_CDI')
  })
})
