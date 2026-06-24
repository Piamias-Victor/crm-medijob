import { z } from 'zod'
import { candidateListFiltersSchema } from '@/view-models/candidate-list-filters.schema'
import { cvthequeExportColumnIdSchema } from '@/view-models/cvtheque-export-column-ids'

export const candidateExportSortSchema = z.object({
  columnId: cvthequeExportColumnIdSchema,
  direction: z.enum(['asc', 'desc']),
})

export const candidateExportInputSchema = candidateListFiltersSchema.extend({
  columnIds: z.array(cvthequeExportColumnIdSchema).min(1),
  sort: candidateExportSortSchema.nullable().optional(),
})

export type CandidateExportInput = z.infer<typeof candidateExportInputSchema>
export type CandidateExportSort = z.infer<typeof candidateExportSortSchema>
