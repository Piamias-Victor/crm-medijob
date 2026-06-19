import { z } from 'zod'
import { ActivityType } from '@prisma/client'

export const activityLogFormSchema = z.object({
  type: z.nativeEnum(ActivityType),
  content: z.string().trim().optional(),
  date: z.string().min(1, 'Date requise'),
})

export type ActivityLogFormInput = z.infer<typeof activityLogFormSchema>
