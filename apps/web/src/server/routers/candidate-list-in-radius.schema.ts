import { z } from 'zod'

export const listPharmaciesInRadiusInputSchema = z.object({
  candidateId: z.string().min(1),
  radiusKm: z.number().int().positive().max(200),
})

export type ListPharmaciesInRadiusInput = z.infer<typeof listPharmaciesInRadiusInputSchema>
