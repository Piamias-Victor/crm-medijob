import { z } from 'zod'

export const pilotageFiltersSchema = z.object({
  exercice: z.string().optional(),
  referentId: z.string().optional(),
})

export type PilotageFilters = z.infer<typeof pilotageFiltersSchema>
