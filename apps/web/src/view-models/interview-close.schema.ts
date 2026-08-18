import { z } from 'zod'

export const interviewCloseSchema = z.object({
  id: z.string().min(1),
  scores: z.record(z.string(), z.number()),
  decision: z.enum(['ELIGIBLE', 'NON_ELIGIBLE', 'REVIEW']),
  overwriteFields: z.array(z.string()),
  mappingEdits: z.record(z.string(), z.string()),
  applyStatus: z.boolean(),
  blacklist: z.boolean(),
})

export type InterviewCloseInput = z.infer<typeof interviewCloseSchema>
