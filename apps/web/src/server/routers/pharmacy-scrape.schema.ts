import { z } from 'zod'
import { MAX_UPLOAD_BYTES, base64SizeError } from '@/lib/upload-base64'

export const pharmacyScrapeUploadSchema = z
  .object({
    filename: z.string().trim().min(1),
    size: z.number().int().positive().max(MAX_UPLOAD_BYTES),
    dataBase64: z.string().min(1),
  })
  .superRefine((input, ctx) => {
    const err = base64SizeError(input.dataBase64, input.size)
    if (err) ctx.addIssue({ code: 'custom', message: err, path: ['dataBase64'] })
    if (!input.filename.toLowerCase().endsWith('.xlsx')) {
      ctx.addIssue({ code: 'custom', message: 'Fichier .xlsx requis', path: ['filename'] })
    }
  })

export const pharmacyScrapeSoftDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(200),
})
