import { z } from 'zod'
import { normalizeFrPhoneDigits } from '@/lib/phone/normalize-fr-phone'

const postalCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{5}$/, 'Le code postal doit contenir 5 chiffres')

const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Le téléphone est obligatoire')
  .transform((value, ctx) => {
    const normalized = normalizeFrPhoneDigits(value)
    if (!normalized) {
      ctx.addIssue({ code: 'custom', message: 'Téléphone français invalide' })
      return z.NEVER
    }
    return normalized
  })

export const publicApplyFormSchema = z.object({
  firstName: z.string().trim().min(1, 'Le prénom est obligatoire'),
  lastName: z.string().trim().min(1, 'Le nom est obligatoire'),
  email: z.string().trim().email('Email invalide'),
  phone: phoneSchema,
  city: z.string().trim().min(1, 'La ville est obligatoire'),
  postalCode: postalCodeSchema,
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  consentGiven: z.boolean().refine((value) => value === true, {
    message: 'Le consentement est obligatoire',
  }),
})

export type PublicApplyFormValues = z.infer<typeof publicApplyFormSchema>

