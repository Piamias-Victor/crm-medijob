import type { PrismaClient } from '@prisma/client'
import { financeLineSelect } from './finance-line.repository.select'
import { toFinanceLineRecord } from './finance-line.repository.map'

type Patch = {
  cancelled?: boolean
  invoiced?: boolean
  paid?: boolean
  pharmacyId?: string | null
  candidateId?: string | null
}

export async function patchFinanceLine(db: PrismaClient, id: string, data: Patch) {
  const row = await db.financeLine.update({
    where: { id },
    data,
    select: financeLineSelect,
  })
  return toFinanceLineRecord(row)
}
