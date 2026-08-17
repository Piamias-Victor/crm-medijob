import { z } from 'zod'

export const listInterviewsSchema = z.object({
  candidateId: z.string().min(1),
})

export const getInterviewSchema = z.object({
  id: z.string().min(1),
})
