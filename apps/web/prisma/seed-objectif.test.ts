import { describe, expect, it } from 'vitest'
import { seedObjectif } from './seed-objectif'
import { DEFAULT_OBJECTIF, OBJECTIF_SINGLETON_ID } from '../src/view-models/objectif'

type ObjectifRow = { id: string } & typeof DEFAULT_OBJECTIF

function memoryDb(seed: ObjectifRow[] = []) {
  const rows = [...seed]
  return {
    rows,
    objectif: {
      findUnique: async ({ where }: { where: { id: string } }) =>
        rows.find((row) => row.id === where.id) ?? null,
      upsert: async ({
        where,
        create,
        update,
      }: {
        where: { id: string }
        create: ObjectifRow
        update: Partial<ObjectifRow>
      }) => {
        const existing = rows.find((row) => row.id === where.id)
        if (!existing) {
          rows.push(create)
          return create
        }
        Object.assign(existing, update)
        return existing
      },
    },
  }
}

describe('seedObjectif', () => {
  it('inserts seeded monthly Objectif amounts when missing', async () => {
    const db = memoryDb()
    await seedObjectif(db as never)
    expect(db.rows[0]).toMatchObject({ id: OBJECTIF_SINGLETON_ID, ...DEFAULT_OBJECTIF })
  })

  it('does not overwrite an existing Objectif', async () => {
    const db = memoryDb([{ id: OBJECTIF_SINGLETON_ID, ...DEFAULT_OBJECTIF, monthlyCaPlacement: 99 }])
    await seedObjectif(db as never)
    expect(db.rows[0]?.monthlyCaPlacement).toBe(99)
  })
})
