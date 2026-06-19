import { z } from 'zod'
import { ACTIVITY_TYPES } from '@/view-models/activity-log-form.schema'
import { DOCUMENT_ENTITY_TYPES } from '@/view-models/activity-log.types'

export const activityEntitySchema = z.object({
  entityType: z.enum(DOCUMENT_ENTITY_TYPES),
  entityId: z.string().min(1),
})

export const listActivityLogSchema = activityEntitySchema.extend({
  types: z.array(z.enum(ACTIVITY_TYPES)).optional(),
})

export const createActivityLogSchema = activityEntitySchema.extend({
  type: z.enum(ACTIVITY_TYPES),
  content: z.string().trim().optional(),
  date: z.coerce.date(),
})
