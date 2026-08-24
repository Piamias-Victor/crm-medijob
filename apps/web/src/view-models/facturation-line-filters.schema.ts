import { z } from 'zod'
import { FINANCE_LINE_KINDS, PLACEMENT_CONTRACT_TYPES } from '@/view-models/finance-line'

export const facturationLineListFiltersSchema = z.object({
  kind: z.enum(FINANCE_LINE_KINDS),
  search: z.string().optional(),
  month: z.string().optional(),
  contractTypes: z.array(z.enum(PLACEMENT_CONTRACT_TYPES)).optional(),
  pharmacyIds: z.array(z.string()).optional(),
  referentIds: z.array(z.string()).optional(),
  cancelled: z.boolean().optional(),
})

export type FacturationLineListFiltersInput = z.infer<typeof facturationLineListFiltersSchema>
