import { z } from 'zod'

export const referentialSchema = z.object({
  name: z.string().trim().min(1, 'Nom requis'),
})

export const updateReferentialSchema = referentialSchema.extend({
  id: z.string().min(1),
})

export const idSchema = z.object({ id: z.string().min(1) })

export const reorderSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
})

export const compatibilityScoreSchema = z.object({
  missionJobTitleId: z.string().min(1),
  candidateJobTitleId: z.string().min(1),
  score: z.number().int().min(0).max(100),
})

/** @deprecated use compatibilityScoreSchema */
export const compatibilitySchema = z.object({
  missionJobTitleId: z.string().min(1),
  candidateJobTitleId: z.string().min(1),
  enabled: z.boolean(),
})

export type ReferentialInput = z.infer<typeof referentialSchema>
export type CompatibilityScoreInput = z.infer<typeof compatibilityScoreSchema>
