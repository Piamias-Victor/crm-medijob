import { z } from 'zod'
import { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'
import { MISSION_STATUS_ORDER } from '@/lib/mission-options'

export const missionListFiltersSchema = z.object({
  contractTypes: z.array(z.enum(CONTRACT_TYPES)).optional(),
  statuses: z.array(z.enum(MISSION_STATUS_ORDER)).optional(),
  jobTitleIds: z.array(z.string()).optional(),
  pharmacyIds: z.array(z.string()).optional(),
  departments: z.array(z.string().regex(/^\d{2}$/)).optional(),
  city: z.string().min(1).optional(),
  referentIds: z.array(z.string()).optional(),
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
})

export type MissionListFilters = z.infer<typeof missionListFiltersSchema>
