import { z } from 'zod'
import { candidateIdSchema } from '@/view-models/candidate-profile.schema'

export const presentToPharmacyInputSchema = z.object({
  candidateId: candidateIdSchema.shape.id,
  pharmacyId: z.string().min(1),
  contactId: z.string().min(1),
})

export type PresentToPharmacyInput = z.infer<typeof presentToPharmacyInputSchema>
