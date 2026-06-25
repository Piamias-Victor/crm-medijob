import { z } from 'zod'
import { isAllowedBlobUrl } from '@/server/services/blob'

export const CONTRACT_TYPES = ['CDI', 'CDD', 'INTERIM', 'VACATION'] as const
export const CREATE_CONTRACT_TYPES = ['CDI', 'CDD', 'INTERIM'] as const

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === '' ? undefined : v))
  .optional()

export const candidateProfileInputSchema = z.object({
  firstName: z.string().trim().min(1, 'Prénom requis'),
  lastName: z.string().trim().min(1, 'Nom requis'),
  email: optionalText.pipe(z.string().email('Email invalide').optional()),
  phone: optionalText,
  address: optionalText,
  city: optionalText,
  postalCode: optionalText,
  jobTitleId: z.string().min(1, 'Métier requis'),
  softwareIds: z.array(z.string()),
  contractTypes: z.array(z.enum(CONTRACT_TYPES)),
  mobilityRadiusKm: z.number().int().min(1).max(500),
  mobilityNotes: optionalText,
  availableFrom: optionalText,
  notes: optionalText,
  referentId: z.string().min(1, 'Référent requis'),
})

export type CandidateProfileInput = z.infer<typeof candidateProfileInputSchema>

export const candidateCreateInputSchema = candidateProfileInputSchema.extend({
  contractTypes: z.array(z.enum(CREATE_CONTRACT_TYPES)),
  cvUrl: z.string().url().refine(isAllowedBlobUrl, 'URL blob non autorisée').optional(),
})

export type CandidateCreateInput = z.infer<typeof candidateCreateInputSchema>

export const updateCandidateSchema = z.object({
  id: z.string().min(1),
  data: candidateProfileInputSchema,
})

export const candidateIdSchema = z.object({ id: z.string().min(1) })
