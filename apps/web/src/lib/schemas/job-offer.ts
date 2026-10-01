import { z } from 'zod'

export const jobOfferMissionIdSchema = z.object({
  missionId: z.string().min(1),
})

export const jobOfferUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
})

export const jobOfferStandaloneCreateSchema = z.object({
  jobTitleId: z.string().min(1),
  jobTitleName: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().optional(),
  contractType: z.enum(['CDI', 'CDD', 'INTERIM', 'VACATION']),
  tempsPlein: z.boolean(),
  salaireMin: z.number().int().nullable().optional(),
  salaireMax: z.number().int().nullable().optional(),
})
