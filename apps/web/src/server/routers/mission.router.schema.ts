import { z } from 'zod'
import {
  markAnnuleeSchema,
  markPourvuSchema,
  updateMissionSchema,
} from '@/view-models/mission-form.schema'

export const missionStatuses = [
  'A_POURVOIR',
  'EN_RECHERCHE',
  'CANDIDATS_PRESENTES',
  'ENTRETIEN_EN_COURS',
  'POURVU',
  'ANNULEE',
] as const

export const idSchema = z.object({ id: z.string().min(1) })
export const pharmacyIdSchema = z.object({ pharmacyId: z.string().min(1) })

export const updateStatusInput = z
  .object({
    id: z.string().min(1),
    status: z.enum(missionStatuses),
    placedCandidateId: z.string().min(1).optional(),
  })
  .refine((v) => v.status !== 'POURVU' || v.placedCandidateId, {
    message: 'placedCandidateId required when status is POURVU',
    path: ['placedCandidateId'],
  })

export { updateMissionSchema, markPourvuSchema, markAnnuleeSchema }

export type UpdateMissionStatusInput = z.infer<typeof updateStatusInput>
