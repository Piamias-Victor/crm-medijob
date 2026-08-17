import { describe, expect, it, vi } from 'vitest'
import { makeInterviewRepository } from './interview.repository'

type Row = {
  id: string
  candidateId: string
  mode: string
  status: string
  deletedAt: Date | null
  answers?: unknown
}

function fakeDb(rows: Row[] = []) {
  return {
    interview: {
      create: vi.fn(async ({ data }: { data: Partial<Row> }) => {
        const row: Row = {
          id: `i-${rows.length + 1}`,
          status: 'DRAFT',
          deletedAt: null,
          candidateId: String(data.candidateId),
          mode: String(data.mode),
        }
        rows.push(row)
        return row
      }),
      findFirst: vi.fn(async ({ where }: { where: Partial<Row> }) =>
        rows.find(
          (row) =>
            (where.id ? row.id === where.id : true) &&
            (where.candidateId ? row.candidateId === where.candidateId : true) &&
            (where.status ? row.status === where.status : true) &&
            (where.deletedAt === null ? row.deletedAt === null : true),
        ) ?? null,
      ),
      update: vi.fn(async ({ where, data }: { where: { id: string }; data: Partial<Row> }) => {
        const row = rows.find((item) => item.id === where.id)
        if (!row) throw new Error('missing')
        Object.assign(row, data)
        return row
      }),
    },
  }
}

describe('interviewRepository draft', () => {
  it('finds the open DRAFT for a candidate', async () => {
    const db = fakeDb()
    const repo = makeInterviewRepository(db as never)
    const created = await repo.create({ candidateId: 'c1', mode: 'INTERIM' })
    expect(await repo.findDraftByCandidate('c1')).toMatchObject({ id: created.id })
  })

  it('soft-deletes a DRAFT so it is no longer the open draft', async () => {
    const db = fakeDb()
    const repo = makeInterviewRepository(db as never)
    const created = await repo.create({ candidateId: 'c1', mode: 'INTERIM' })
    const result = await repo.softDelete(created.id)
    expect(result).toEqual({ candidateId: 'c1' })
    expect(await repo.findDraftByCandidate('c1')).toBeNull()
  })

  it('persists draft answers on the interview', async () => {
    const db = fakeDb()
    const repo = makeInterviewRepository(db as never)
    const created = await repo.create({ candidateId: 'c1', mode: 'INTERIM' })
    const answers = { questions: { q1: { choiceLabel: 'Oui' } }, checklist: { cv: true } }
    await repo.updateAnswers(created.id, answers)
    expect(await repo.findById(created.id)).toMatchObject({ answers })
  })
})
