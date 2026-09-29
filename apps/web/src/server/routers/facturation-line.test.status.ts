import { TRPCError } from '@trpc/server'
import type { FinanceLineRecord } from '@/view-models/finance-line'

function requireLine(lines: FinanceLineRecord[], id: string) {
  const line = lines.find((row) => row.id === id)
  if (!line) throw new TRPCError({ code: 'NOT_FOUND', message: 'Ligne introuvable' })
  return line
}

export function memoryLineStatus(lines: FinanceLineRecord[]) {
  return {
    cancelLine: async (id: string) => {
      const line = requireLine(lines, id)
      line.cancelled = true
      return line
    },
    restoreLine: async (id: string) => {
      const line = requireLine(lines, id)
      line.cancelled = false
      return line
    },
    setInvoiced: async (id: string, invoiced: boolean) => {
      const line = requireLine(lines, id)
      line.invoiced = invoiced
      return line
    },
    setPaid: async (id: string, paid: boolean) => {
      const line = requireLine(lines, id)
      line.paid = paid
      return line
    },
    linkLine: async (input: {
      id: string
      pharmacyId?: string | null
      candidateId?: string | null
    }) => {
      const line = requireLine(lines, input.id)
      if (input.pharmacyId !== undefined) {
        line.pharmacyId = input.pharmacyId
        if (input.pharmacyId) line.pharmacyName = 'Pharma Nord'
      }
      if (input.candidateId !== undefined) {
        line.candidateId = input.candidateId
        if (input.candidateId) line.candidateName = 'Ada Lovelace'
      }
      return line
    },
  }
}
