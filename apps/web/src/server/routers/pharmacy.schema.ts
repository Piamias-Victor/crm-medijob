import { z } from 'zod'

export const PHARMACY_STATUSES = ['PROSPECT', 'ACTIF', 'INACTIF'] as const

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === '' ? undefined : v))
  .optional()

export const pharmacyInputSchema = z.object({
  name: z.string().trim().min(1, 'Nom requis'),
  siret: optionalText,
  numeroTVA: optionalText,
  address: optionalText,
  city: optionalText,
  postalCode: optionalText,
  phone: optionalText,
  email: optionalText.pipe(z.string().email('Email invalide').optional()),
  website: optionalText,
  status: z.enum(PHARMACY_STATUSES).default('PROSPECT'),
  groupementId: optionalText,
  softwareId: optionalText,
  paymentConditions: optionalText,
  notes: optionalText,
})

export type PharmacyInput = z.input<typeof pharmacyInputSchema>

export const updatePharmacySchema = z.object({
  id: z.string().min(1),
  data: pharmacyInputSchema,
})

export const searchSiretSchema = z.object({ query: z.string().trim().min(3) })
