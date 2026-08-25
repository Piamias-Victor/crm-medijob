import type { PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import {
  DEFAULT_OBJECTIF,
  OBJECTIF_SINGLETON_ID,
  type Objectif,
} from '@/view-models/objectif'

function toObjectif(row: Objectif): Objectif {
  return {
    monthlyCaPlacement: row.monthlyCaPlacement,
    monthlyMargePlacement: row.monthlyMargePlacement,
    monthlyCaInterim: row.monthlyCaInterim,
    monthlyMargeInterim: row.monthlyMargeInterim,
    monthlyRentabilityThreshold: row.monthlyRentabilityThreshold,
  }
}

export function makeObjectifRepository(db: PrismaClient = defaultDb) {
  return {
    get: async () => {
      const row = await db.objectif.findUnique({ where: { id: OBJECTIF_SINGLETON_ID } })
      return row ? toObjectif(row) : DEFAULT_OBJECTIF
    },
    save: async (input: Objectif) => {
      const row = await db.objectif.upsert({
        where: { id: OBJECTIF_SINGLETON_ID },
        update: input,
        create: { id: OBJECTIF_SINGLETON_ID, ...input },
      })
      return toObjectif(row)
    },
  }
}

export const objectifRepository = makeObjectifRepository()
