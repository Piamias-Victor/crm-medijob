import { z } from 'zod'
import { parseAmount } from '@/lib/finance/calculate-interim-libre'
import { FINANCE_LINE_KINDS } from '@/view-models/finance-line'

const optionalMarge = z.preprocess(parseAmount, z.number().min(0).nullable())
const optionalAmount = z.preprocess(parseAmount, z.number().positive().nullable())

export const createFinanceLineSchema = z.object({
  pharmacyId: z.string().min(1),
  candidateId: z.string().min(1),
  missionId: z.string().min(1).nullable().optional(),
  kind: z.enum(FINANCE_LINE_KINDS),
  hours: optionalAmount.optional(),
  hourlyRate: optionalAmount.optional(),
  amountHt: z.preprocess(parseAmount, z.number().positive()),
  htSource: z.enum(['ENGINE', 'TYPED']).optional(),
  marge: optionalMarge.optional(),
  occurredAt: z.coerce.date(),
})

export type CreateFinanceLineInput = z.infer<typeof createFinanceLineSchema>

export const generateDevisFromLineSchema = z.object({
  id: z.string().min(1),
})
