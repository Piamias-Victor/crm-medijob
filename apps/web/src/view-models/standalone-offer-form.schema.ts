import { z } from 'zod'

export const standaloneOfferFormSchema = z.object({
  jobTitleId: z.string().min(1, 'Métier requis'),
  jobTitleName: z.string().min(1),
  city: z.string().min(1, 'Ville requise'),
  postalCode: z.string().optional(),
  contractType: z.enum(['CDI', 'CDD', 'INTERIM', 'VACATION']),
  tempsPlein: z.boolean(),
})

export type StandaloneOfferFormValues = z.infer<typeof standaloneOfferFormSchema>
