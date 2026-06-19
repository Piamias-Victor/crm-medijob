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

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === '' ? undefined : v))
  .optional()

const scopeSchema = z
  .object({
    contactId: z.string().min(1).optional(),
    pharmacyId: z.string().min(1).optional(),
  })
  .refine((data) => Boolean(data.contactId) !== Boolean(data.pharmacyId), {
    message: 'contactId ou pharmacyId requis',
  })

export const activityLogListSchema = scopeSchema.and(
  z.object({ types: z.array(z.enum(ACTIVITY_TYPES)).optional() }),
)

export const activityLogCreateSchema = scopeSchema.and(
  z.object({
    type: z.enum(ACTIVITY_TYPES),
    content: optionalText,
    date: z.coerce.date().optional(),
  }),
)
import { ActivityType } from '@prisma/client'

export const activityLogFormSchema = z.object({
  type: z.nativeEnum(ActivityType),
  content: z.string().trim().optional(),
  date: z.string().min(1, 'Date requise'),
})

export type ActivityLogFormInput = z.infer<typeof activityLogFormSchema>
