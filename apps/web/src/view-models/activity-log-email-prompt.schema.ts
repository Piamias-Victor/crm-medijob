import { z } from 'zod'

export const activityLogEmailPromptSchema = z.object({
  content: z.string().trim().optional(),
})

export type ActivityLogEmailPromptInput = z.infer<typeof activityLogEmailPromptSchema>
