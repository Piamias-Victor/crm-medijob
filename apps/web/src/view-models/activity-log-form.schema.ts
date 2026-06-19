import { z } from 'zod'
import { ActivityType } from '@prisma/client'

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

export const activityLogFormSchema = z.object({
  type: z.nativeEnum(ActivityType),
  content: z.string().trim().optional(),
  date: z.string().min(1, 'Date requise'),
})

export type ActivityLogFormInput = z.infer<typeof activityLogFormSchema>
