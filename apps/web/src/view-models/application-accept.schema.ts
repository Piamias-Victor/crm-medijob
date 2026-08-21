import { z } from 'zod'
import { candidateCreateInputSchema } from '@/view-models/candidate-profile.schema'
import { idSchema } from '@/lib/schemas/entity-id'

export const applicationAcceptSchema = z
  .object({
    id: z.string().min(1),
    data: candidateCreateInputSchema.optional(),
    mergeCandidateId: z.string().min(1).optional(),
  })
  .refine((v) => Boolean(v.data || v.mergeCandidateId), {
    message: 'data ou mergeCandidateId requis',
  })
