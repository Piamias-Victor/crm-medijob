import { z } from 'zod'
import { INTERVIEW_CONTACT_REQUIRED } from '@/view-models/interview-copy'

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .optional()

export const interviewStartSchema = z
  .object({
    candidateId: z.string().min(1).optional(),
    firstName: z.string().trim().min(1, 'Prénom requis'),
    lastName: z.string().trim().min(1, 'Nom requis'),
    email: optionalText.pipe(z.string().email('Email invalide').optional()),
    phone: optionalText,
    jobTitleId: z.string().min(1, 'Métier requis'),
    mode: z.enum(['INTERIM', 'CDD_CDI']),
  })
  .refine((value) => Boolean(value.email || value.phone), {
    message: INTERVIEW_CONTACT_REQUIRED,
    path: ['phone'],
  })

export type InterviewStartInput = z.infer<typeof interviewStartSchema>

export const interviewAbandonSchema = z.object({
  id: z.string().min(1),
})
