import { z } from 'zod'
import { PHARMACY_STATUSES } from '@/view-models/pharmacy-form.schema'

export const pharmacyListFiltersSchema = z.object({
  statuses: z.array(z.enum(PHARMACY_STATUSES)).optional(),
  groupementIds: z.array(z.string()).optional(),
  softwareIds: z.array(z.string()).optional(),
  departments: z.array(z.string().regex(/^\d{2}$/)).optional(),
  activeMission: z.boolean().nullable().optional(),
})

export type PharmacyListFilters = z.infer<typeof pharmacyListFiltersSchema>
