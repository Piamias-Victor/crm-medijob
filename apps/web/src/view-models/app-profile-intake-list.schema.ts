import { z } from 'zod'

export const listIntakeFollowUpSchema = z.object({
  referentScope: z.enum(['mine', 'all']).default('mine'),
  population: z.enum(['default', 'archive']).default('default'),
})

export type ListIntakeFollowUpInput = z.infer<typeof listIntakeFollowUpSchema>
