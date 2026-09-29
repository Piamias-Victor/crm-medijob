import { z } from 'zod'
import { idSchema } from '@/lib/schemas/entity-id'

export { idSchema }

export const referentialSchema = z.object({
  name: z.string().trim().min(1, 'Nom requis'),
})

export const updateReferentialSchema = referentialSchema.extend({
  id: z.string().min(1),
})

export const reorderSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
})

const HEX_3 = /^#([0-9a-fA-F]{3})$/
const HEX_6 = /^#([0-9a-fA-F]{6})$/

export function normalizeHexColor(raw: string): string | null {
  const value = raw.trim()
  const short = HEX_3.exec(value)
  if (short?.[1]) {
    return `#${short[1]
      .split('')
      .map((c) => `${c}${c}`)
      .join('')
      .toUpperCase()}`
  }
  const full = HEX_6.exec(value)
  return full ? `#${full[1].toUpperCase()}` : null
}

export const hexColorSchema = z.string().trim().transform((value, ctx) => {
  const normalized = normalizeHexColor(value)
  if (!normalized) {
    ctx.addIssue({ code: 'custom', message: 'Couleur hex invalide' })
    return z.NEVER
  }
  return normalized
})

export const intakeStatusAdminSchema = referentialSchema.extend({
  color: hexColorSchema,
})

export const updateIntakeStatusAdminSchema = intakeStatusAdminSchema.extend({
  id: z.string().min(1),
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
