import { z } from 'zod'

export const globalSearchInputSchema = z.object({
  term: z.string().max(100),
})
