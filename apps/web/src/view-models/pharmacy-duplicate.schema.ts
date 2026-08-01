import { z } from 'zod'
import { pharmacyInputSchema } from '@/view-models/pharmacy-form.schema'
import { identityKeysReady } from '@/server/pharmacy/normalize-pharmacy-identity'

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === '' ? undefined : v))
  .optional()

export const detectPharmacyDuplicateInputSchema = z
  .object({
    name: optionalText,
    siret: optionalText,
    city: optionalText,
    postalCode: optionalText,
    excludeId: z.string().min(1).optional(),
  })
  .refine((value) => identityKeysReady(value), {
    message: 'SIRET ou nom + ville + code postal requis',
  })

export const pharmacyMergeInputSchema = z.object({
  keptId: z.string().min(1),
  absorbedId: z.string().min(1).optional(),
  data: pharmacyInputSchema,
})

export type DetectPharmacyDuplicateInput = z.infer<typeof detectPharmacyDuplicateInputSchema>
export type PharmacyMergeInput = z.infer<typeof pharmacyMergeInputSchema>
