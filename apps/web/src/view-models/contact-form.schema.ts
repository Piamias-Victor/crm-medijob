import { z } from 'zod'
import { optionalReferentIdSchema } from '@/view-models/optional-referent-id.schema'

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === '' ? undefined : v))
  .optional()

export const contactInputSchema = z.object({
  pharmacyId: z.string().min(1, 'Pharmacie requise'),
  firstName: z.string().trim().min(1, 'Prénom requis'),
  lastName: z.string().trim().min(1, 'Nom requis'),
  email: optionalText.pipe(z.string().email('Email invalide').optional()),
  phone: optionalText,
  contactRoleId: z.string().min(1, 'Fonction requise'),
  isPrimary: z.boolean().default(false),
  notes: optionalText,
  referentId: optionalReferentIdSchema,
})

export type ContactInput = z.input<typeof contactInputSchema>

export const updateContactSchema = z.object({
  id: z.string().min(1),
  data: contactInputSchema,
})
