import { z } from 'zod'
import { availabilitySlotSchema } from '@/view-models/weekly-availability.schema'

export const weeklyAvailabilityFilterInputSchema = z.object({
  date: availabilitySlotSchema.shape.date,
  period: availabilitySlotSchema.shape.period,
  jobTitleId: z.string().min(1),
  city: z.string().trim().min(1),
  radiusKm: z.number().int().positive().optional(),
})

export type WeeklyAvailabilityFilterInput = z.infer<
  typeof weeklyAvailabilityFilterInputSchema
>
