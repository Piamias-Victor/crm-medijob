import { z } from 'zod'
import { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'

export const missionQuickCreateSchema = z.object({
  pharmacyId: z.string().min(1),
  title: z.string().trim().min(1, 'Titre requis'),
  jobTitleId: z.string().min(1, 'Métier requis'),
  contractType: z.enum(CONTRACT_TYPES),
  startDate: z.date().optional(),
  referentId: z.string().min(1, 'Référent requis'),
})

export type MissionQuickCreateInput = z.infer<typeof missionQuickCreateSchema>
