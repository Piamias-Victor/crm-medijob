import { z } from 'zod'
import { publicApplyFormSchema } from '@/view-models/public-apply.schema'

export const publicApplyClientInputSchema = publicApplyFormSchema.extend({
  boardListingId: z.string().min(1).optional(),
  cvFilename: z.string().min(1),
  cvBase64: z.string().min(1),
})

export const publicApplySubmitInputSchema = publicApplyClientInputSchema.extend({
  clientIp: z.string().min(1),
})

export type PublicApplySubmitInput = z.infer<typeof publicApplySubmitInputSchema>
