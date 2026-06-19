import { z } from 'zod'
import { cvUploadError } from '@/lib/cv-upload'
import { candidateProfileInputSchema } from '@/view-models/candidate-profile.schema'

const cvFileSchema = z.object({
  filename: z.string().trim().min(1),
  mimeType: z.string().trim().min(1),
  size: z.number().int().positive().max(10 * 1024 * 1024),
  dataBase64: z.string().min(1),
})

export const extractCvSchema = z
  .object({ candidateId: z.string().min(1) })
  .and(cvFileSchema)
  .superRefine((input, ctx) => {
    const message = cvUploadError(input)
    if (message) ctx.addIssue({ code: 'custom', message, path: ['filename'] })
  })

export const confirmCvExtractionSchema = z.object({
  candidateId: z.string().min(1),
  cvUrl: z.string().url(),
  data: candidateProfileInputSchema,
})

export type ExtractCvInput = z.infer<typeof extractCvSchema>
export type ConfirmCvExtractionInput = z.infer<typeof confirmCvExtractionSchema>
