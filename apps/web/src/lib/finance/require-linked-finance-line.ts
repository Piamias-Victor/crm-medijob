import { TRPCError } from '@trpc/server'
import type { FinanceLineRecord } from '@/view-models/finance-line'

export type LinkedFinanceLine = FinanceLineRecord & {
  pharmacyId: string
  candidateId: string
}

export function requireLinkedFinanceLine(line: FinanceLineRecord): LinkedFinanceLine {
  if (!line.pharmacyId || !line.candidateId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Lier Pharmacie et Candidat avant de générer un devis',
    })
  }
  return line as LinkedFinanceLine
}
