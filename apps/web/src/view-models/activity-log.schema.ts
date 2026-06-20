import { z } from 'zod'
import { DOCUMENT_ENTITY_TYPES } from '@/view-models/activity-log.types'

export const ACTIVITY_TYPES = [
  'APPEL',
  'EMAIL',
  'ENTRETIEN',
  'MISSION',
  'NOTE',
  'ACTION_COMMERCIALE',
  'DEVIS',
  'AUTRE',
] as const

export type ActivityTypeValue = (typeof ACTIVITY_TYPES)[number]

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
