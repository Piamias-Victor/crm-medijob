import { z } from 'zod'
import { PHARMACY_STATUSES } from '@/view-models/pharmacy-form.schema'

export const contactListFiltersSchema = z.object({
  contactRoleIds: z.array(z.string()).optional(),
  pharmacyIds: z.array(z.string()).optional(),
  departments: z.array(z.string().regex(/^\d{2}$/)).optional(),
  pharmacyStatuses: z.array(z.enum(PHARMACY_STATUSES)).optional(),
  isPrimary: z.boolean().nullable().optional(),
  referentIds: z.array(z.string()).optional(),
  city: z.string().optional(),
})

export type ContactListFilters = z.infer<typeof contactListFiltersSchema>
