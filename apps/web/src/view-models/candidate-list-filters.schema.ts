import { z } from 'zod'

export const candidateListFiltersSchema = z.object({
  jobTitleIds: z.array(z.string()).optional(),
  available: z.boolean().nullable().optional(),
  departments: z.array(z.string().regex(/^\d{2}$/)).optional(),
  referentIds: z.array(z.string()).optional(),
  softwareIds: z.array(z.string()).optional(),
  contractTypes: z.array(z.enum(['CDI', 'CDD', 'INTERIM'])).optional(),
  profileIncomplete: z.boolean().nullable().optional(),
  activeMission: z.boolean().nullable().optional(),
})

export type CandidateListFilters = z.infer<typeof candidateListFiltersSchema>
