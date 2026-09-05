import { z } from 'zod'
import { availabilitySlotSchema } from '@/view-models/weekly-availability.schema'

export const availabilitySearchFiltersSchema = z.object({
  q: z.string().trim().min(1).optional(),
  jobTitleIds: z.array(z.string()).optional(),
  dateFrom: availabilitySlotSchema.shape.date.optional(),
  dateTo: availabilitySlotSchema.shape.date.optional(),
  period: availabilitySlotSchema.shape.period.optional(),
  city: z.string().trim().min(1).optional(),
  radiusKm: z.number().int().min(1).max(500).optional(),
  hasDispo: z.enum(['all', 'yes', 'no']).optional(),
})

export type AvailabilitySearchFilters = z.infer<typeof availabilitySearchFiltersSchema>
