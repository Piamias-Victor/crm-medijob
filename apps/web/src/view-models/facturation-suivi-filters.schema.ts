import { z } from 'zod'
import { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'
import { COMMERCIAL_STATUSES } from '@/lib/finance/derive-commercial-status'

export const facturationSuiviFiltersSchema = z.object({
  contractTypes: z.array(z.enum(CONTRACT_TYPES)).optional(),
  pharmacyIds: z.array(z.string()).optional(),
  referentIds: z.array(z.string()).optional(),
  commercialStatuses: z.array(z.enum(COMMERCIAL_STATUSES)).optional(),
  sentFrom: z.string().optional(),
  sentTo: z.string().optional(),
  acceptedFrom: z.string().optional(),
  acceptedTo: z.string().optional(),
})

export type FacturationSuiviFilters = z.infer<typeof facturationSuiviFiltersSchema>
