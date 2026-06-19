import { z } from 'zod'
import { ActivityType, DocumentEntityType } from '@prisma/client'

export const activityEntitySchema = z.object({
  entityType: z.nativeEnum(DocumentEntityType),
  entityId: z.string().min(1),
})

export const listActivityLogSchema = activityEntitySchema.extend({
  type: z.nativeEnum(ActivityType).optional(),
})

export const createActivityLogSchema = activityEntitySchema.extend({
  type: z.nativeEnum(ActivityType),
  content: z.string().trim().optional(),
  date: z.coerce.date(),
})
