import { z } from 'zod'

export const jobOfferMissionIdSchema = z.object({
  missionId: z.string().min(1),
})

export const jobOfferUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(100),
})
