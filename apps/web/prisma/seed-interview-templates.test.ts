import { describe, expect, it } from 'vitest'
import type { InterviewMode } from '@prisma/client'
import { seedInterviewTemplates } from './seed-interview-templates'

type SeedRow = {
  id: string
  profileKey: string
  mode: InterviewMode
  version: number
  label: string
  sections: unknown
}

function memorySeedDb(seed: SeedRow[] = []) {
  const rows = [...seed]
  let n = seed.length
  return {
    rows,
    interviewTemplate: {
      findFirst: async ({ where }: { where: { profileKey: string; mode: InterviewMode } }) =>
        rows.find((row) => row.profileKey === where.profileKey && row.mode === where.mode) ?? null,
      create: async ({ data }: { data: Omit<SeedRow, 'id'> }) => {
        const row = { ...data, id: `tpl-${++n}` }
        rows.push(row)
        return row
      },
    },
  }
}

describe('seedInterviewTemplates', () => {
  it('does not overwrite an existing trame for the same profileKey × mode', async () => {
    const db = memorySeedDb([
      {
        id: 'tpl-crm',
        profileKey: 'pharmacien',
        mode: 'INTERIM',
        version: 1,
        label: 'CRM edit',
        sections: [{ id: 'custom' }],
      },
    ])
    await seedInterviewTemplates(db as never)
    const row = db.rows.find((item) => item.profileKey === 'pharmacien' && item.mode === 'INTERIM')
    expect(row?.label).toBe('CRM edit')
    expect(row?.sections).toEqual([{ id: 'custom' }])
  })

  it('inserts version 1 when the couple is missing', async () => {
    const db = memorySeedDb()
    await seedInterviewTemplates(db as never)
    const row = db.rows.find((item) => item.profileKey === 'pharmacien' && item.mode === 'INTERIM')
    expect(row?.version).toBe(1)
    expect(row?.label).toBeTruthy()
  })

  it('does not insert again on a second run', async () => {
    const db = memorySeedDb()
    await seedInterviewTemplates(db as never)
    const count = db.rows.length
    await seedInterviewTemplates(db as never)
    expect(db.rows).toHaveLength(count)
  })
})
