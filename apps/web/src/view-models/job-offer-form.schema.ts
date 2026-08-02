import { z } from 'zod'

export const jobOfferFormSchema = z.object({
  title: z.string().min(1, 'Titre requis'),
  content: z.string().min(100, 'Contenu : 100 caractères minimum'),
})

export type JobOfferFormValues = z.infer<typeof jobOfferFormSchema>
