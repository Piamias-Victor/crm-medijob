import { z } from 'zod'
import { isAllowedBlobUrl } from '@/server/services/blob'
import { candidateProfileInputSchema } from '@/view-models/candidate-profile.schema'

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === '' ? undefined : v))
  .optional()

const optionalName = z
  .string()
  .trim()
  .transform((v) => (v === '' ? undefined : v))
  .optional()

export const detectDuplicateInputSchema = z
  .object({
    firstName: optionalName,
    lastName: optionalName,
    email: optionalText.pipe(z.string().email('Email invalide').optional()),
    phone: optionalText,
    excludeId: z.string().min(1).optional(),
  })
  .refine(
    (value) =>
      Boolean(value.email) ||
      Boolean(value.firstName && value.lastName && value.phone),
    { message: 'Email ou prénom + nom + téléphone requis' },
  )

export const candidateMergeInputSchema = z.object({
  keptId: z.string().min(1),
  absorbedId: z.string().min(1).optional(),
  data: candidateProfileInputSchema,
  cvUrl: z.string().url().refine(isAllowedBlobUrl, 'URL blob non autorisée').optional(),
})

export type DetectDuplicateInput = z.infer<typeof detectDuplicateInputSchema>
export type CandidateMergeInput = z.infer<typeof candidateMergeInputSchema>
