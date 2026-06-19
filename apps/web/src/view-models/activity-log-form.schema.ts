import { z } from 'zod'

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
  type: z.enum(ACTIVITY_TYPES),
  content: z.string().trim().optional(),
  date: z.string().min(1, 'Date requise'),
})

export type ActivityLogFormInput = z.infer<typeof activityLogFormSchema>
