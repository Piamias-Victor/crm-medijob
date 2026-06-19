import { z } from 'zod'
import { documentUploadError } from '@/lib/document-upload'

const entityTypes = ['PHARMACY', 'CONTACT', 'MISSION', 'CANDIDATE'] as const
const categories = ['CONTRAT', 'DEVIS', 'FACTURE', 'CONVENTION', 'AUTRE'] as const

export const listDocumentsSchema = z.object({
  entityType: z.enum(entityTypes),
  entityId: z.string().min(1),
})

const uploadFileSchema = z.object({
  filename: z.string().trim().min(1),
  mimeType: z.string().trim().min(1),
  size: z.number().int().positive().max(10 * 1024 * 1024),
  dataBase64: z.string().min(1),
})

export const uploadDocumentSchema = z
  .object({
    entityType: z.enum(entityTypes),
    entityId: z.string().min(1),
    category: z.enum(categories),
  })
  .and(uploadFileSchema)
  .superRefine((input, ctx) => {
    const message = documentUploadError(input)
    if (message) ctx.addIssue({ code: 'custom', message, path: ['filename'] })
  })

export const deleteDocumentSchema = z.object({ id: z.string().min(1) })

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>
