import { z } from 'zod'

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === '' ? undefined : v))
  .optional()

export const candidateQuickCreateSchema = z.object({
  firstName: z.string().trim().min(1, 'Prénom requis'),
  lastName: z.string().trim().min(1, 'Nom requis'),
  email: optionalText.pipe(z.string().email('Email invalide').optional()),
  phone: optionalText,
  city: optionalText,
  jobTitleId: z.string().min(1, 'Métier requis'),
  referentId: z.string().min(1, 'Référent requis'),
})

export type CandidateQuickCreateInput = z.infer<typeof candidateQuickCreateSchema>
