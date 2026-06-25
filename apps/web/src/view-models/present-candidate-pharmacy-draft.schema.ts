import { z } from 'zod'

export const presentCandidateDraftSchema = z.object({
  subject: z.string().min(1, 'Objet requis'),
  body: z.string().min(1, 'Message requis'),
})

export type PresentCandidateDraft = z.infer<typeof presentCandidateDraftSchema>
