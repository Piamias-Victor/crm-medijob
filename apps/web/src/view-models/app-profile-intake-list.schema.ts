import { z } from 'zod'

export const listIntakeFollowUpSchema = z.object({
  referentScope: z.enum(['mine', 'all']).default('mine'),
})

export type ListIntakeFollowUpInput = z.infer<typeof listIntakeFollowUpSchema>
