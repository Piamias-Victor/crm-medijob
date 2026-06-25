import { z } from 'zod'
import { CONTACT_ROLES } from '@/view-models/contact-form.schema'
import { PHARMACY_STATUSES } from '@/view-models/pharmacy-form.schema'

export const contactListFiltersSchema = z.object({
  roles: z.array(z.enum(CONTACT_ROLES)).optional(),
  pharmacyIds: z.array(z.string()).optional(),
  departments: z.array(z.string().regex(/^\d{2}$/)).optional(),
  pharmacyStatuses: z.array(z.enum(PHARMACY_STATUSES)).optional(),
  isPrimary: z.boolean().nullable().optional(),
})

export type ContactListFilters = z.infer<typeof contactListFiltersSchema>
