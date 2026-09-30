import { z } from 'zod'

export const linkFinanceLineSchema = z.object({
  id: z.string().min(1),
  pharmacyId: z.string().min(1).nullable().optional(),
  candidateId: z.string().min(1).nullable().optional(),
})

export type LinkFinanceLineInput = z.infer<typeof linkFinanceLineSchema>
