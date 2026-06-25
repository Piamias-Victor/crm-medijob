import { z } from 'zod'

export const presentInRadiusInputSchema = z.object({
  candidateId: z.string().min(1),
})

export type PresentInRadiusInput = z.infer<typeof presentInRadiusInputSchema>
