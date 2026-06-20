import { z } from 'zod'
import { summaryResponseSchema } from '@/server/ai/schemas'

export const saveCvSummarySchema = z.object({
  id: z.string().min(1),
  cvSummary: summaryResponseSchema.shape.summary,
})

export type SaveCvSummaryInput = z.infer<typeof saveCvSummarySchema>
