import { z } from 'zod'
import { CANDIDATE_STATUSES } from '@/view-models/candidate-status'

export const candidateListFiltersSchema = z.object({
  q: z.string().trim().min(1).optional(),
  jobTitleIds: z.array(z.string()).optional(),
  available: z.boolean().nullable().optional(),
  departments: z.array(z.string().regex(/^\d{2}$/)).optional(),
  referentIds: z.array(z.string()).optional(),
  softwareIds: z.array(z.string()).optional(),
  contractTypes: z.array(z.enum(['CDI', 'CDD', 'INTERIM'])).optional(),
  profileIncomplete: z.boolean().nullable().optional(),
  activeMission: z.boolean().nullable().optional(),
  statuses: z.array(z.enum(CANDIDATE_STATUSES)).optional(),
  origins: z.array(z.enum(['CRM', 'APP'])).optional(),
  city: z.string().trim().min(1).optional(),
  maxMobilityKm: z.number().int().min(1).max(500).optional(),
  declaredAvailability: z.boolean().nullable().optional(),
})

export type CandidateListFilters = z.infer<typeof candidateListFiltersSchema>
