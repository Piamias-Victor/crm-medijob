import { z } from 'zod'

export const pharmacyScrapeListFiltersSchema = z.object({
  q: z.string().trim().optional(),
  department: z.string().trim().min(1).optional(),
  provenance: z.string().trim().min(1).optional(),
  duplicatesOnly: z.boolean().optional(),
})

export type PharmacyScrapeListFiltersInput = z.infer<typeof pharmacyScrapeListFiltersSchema>
