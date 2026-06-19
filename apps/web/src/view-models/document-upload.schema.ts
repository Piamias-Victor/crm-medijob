import { z } from 'zod'
import { DOCUMENT_CATEGORIES } from '@/view-models/document.types'
import { documentUploadError } from '@/lib/document-upload'

const MAX_BYTES = 10 * 1024 * 1024

export const documentUploadFormSchema = z
  .object({
    category: z.enum(DOCUMENT_CATEGORIES),
    filename: z.string().trim().min(1),
    mimeType: z.string().trim().min(1),
    size: z.number().int().positive().max(MAX_BYTES),
    dataBase64: z.string().min(1),
  })
  .superRefine((input, ctx) => {
    const message = documentUploadError(input)
    if (message) ctx.addIssue({ code: 'custom', message, path: ['filename'] })
  })

export type DocumentUploadFormInput = z.infer<typeof documentUploadFormSchema>
