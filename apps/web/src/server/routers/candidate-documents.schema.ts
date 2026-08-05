import { z } from 'zod'
import { summaryResponseSchema } from '@/server/ai/schemas'
import { anonymizedDossierSchema } from '@/view-models/anonymized-dossier.schema'

export const saveCvSummarySchema = z.object({
  id: z.string().min(1),
  cvSummary: summaryResponseSchema.shape.summary,
})

export const saveAnonymizedSchema = z.object({
  id: z.string().min(1),
  dossier: anonymizedDossierSchema,
})

export type SaveCvSummaryInput = z.infer<typeof saveCvSummarySchema>
export type SaveAnonymizedInput = z.infer<typeof saveAnonymizedSchema>
