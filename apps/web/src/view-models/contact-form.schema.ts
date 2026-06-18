import { z } from 'zod'

export const CONTACT_ROLES = [
  'TITULAIRE',
  'ADJOINT',
  'PREPARATEUR_REFERENT',
  'RESPONSABLE_RH',
  'AUTRE',
] as const

export type ContactRole = (typeof CONTACT_ROLES)[number]

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
  role: z.enum(CONTACT_ROLES).default('AUTRE'),
  isPrimary: z.boolean().default(false),
  notes: optionalText,
})

export type ContactInput = z.input<typeof contactInputSchema>

export const updateContactSchema = z.object({
  id: z.string().min(1),
  data: contactInputSchema,
})
