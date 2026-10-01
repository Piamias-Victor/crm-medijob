import { z } from 'zod'
import { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'

export const JOB_OFFER_STATUSES = ['BROUILLON', 'PUBLIEE', 'DEPUBLIEE'] as const
export const JOB_OFFER_SOURCES = ['mission', 'standalone'] as const

export const jobOfferListFiltersSchema = z.object({
  contractTypes: z.array(z.enum(CONTRACT_TYPES)).optional(),
  statuses: z.array(z.enum(JOB_OFFER_STATUSES)).optional(),
  sources: z.array(z.enum(JOB_OFFER_SOURCES)).optional(),
  jobTitleIds: z.array(z.string()).optional(),
  pharmacyIds: z.array(z.string()).optional(),
  departments: z.array(z.string().regex(/^\d{2}$/)).optional(),
  city: z.string().min(1).optional(),
  referentIds: z.array(z.string()).optional(),
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
})

export type JobOfferListFilters = z.infer<typeof jobOfferListFiltersSchema>
