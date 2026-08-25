import { z } from 'zod'

const lineId = z.string().min(1)

export const setLineInvoicedSchema = z.object({
  id: lineId,
  invoiced: z.boolean(),
})

export const setLinePaidSchema = z.object({
  id: lineId,
  paid: z.boolean(),
})
