import { z } from 'zod'

export const weeklyAvailabilityTokenSchema = z
  .string()
  .min(20)
  .max(64)
  .regex(/^[A-Za-z0-9_-]+$/)

const ymdSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const availabilitySlotSchema = z.object({
  date: ymdSchema,
  period: z.enum(['AM', 'PM']),
})

export const getWeekInputSchema = z.object({
  token: weeklyAvailabilityTokenSchema,
  weekStart: ymdSchema.optional(),
})

export const saveWeekInputSchema = getWeekInputSchema.extend({
  slots: z.array(availabilitySlotSchema).max(14),
})

const monthSchema = z.string().regex(/^\d{4}-\d{2}$/)

export const getMonthInputSchema = z.object({
  token: weeklyAvailabilityTokenSchema,
  month: monthSchema.optional(),
})

export const saveMonthInputSchema = getMonthInputSchema.extend({
  slots: z.array(availabilitySlotSchema).max(62),
})

export const candidateMonthInputSchema = z.object({
  candidateId: z.string().min(1),
  month: monthSchema.optional(),
})

export const saveCandidateMonthInputSchema = candidateMonthInputSchema.extend({
  slots: z.array(availabilitySlotSchema).max(62),
})

export type AvailabilitySlotInput = z.infer<typeof availabilitySlotSchema>
