import { z } from 'zod'
import { ACTIVITY_FORM_TYPES } from '@/view-models/activity-log.schema'

export type { ActivityTypeValue, ActivityFormTypeValue } from '@/view-models/activity-log.schema'

export const activityLogFormSchema = z.object({
  type: z.enum(ACTIVITY_FORM_TYPES),
  content: z.string().trim().optional(),
  date: z.string().min(1, 'Date requise'),
})

export type ActivityLogFormInput = z.infer<typeof activityLogFormSchema>
