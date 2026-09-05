import { z } from 'zod'

// Models routinely fill unknown fields with null or wrap the answer in a fence:
// each field degrades on its own so one bad value never voids the extraction.
export const commentIntakeSchema = z.object({
  jobTitle: z.string().nullish().catch(null),
  softwares: z.array(z.string()).nullish().catch(null),
  availableFrom: z.string().datetime().nullish().catch(null),
  mobilityRadiusKm: z.number().int().min(1).max(500).nullish().catch(null),
  mobilityNotes: z.string().nullish().catch(null),
})

export type CommentIntakeAi = {
  jobTitle?: string
  softwares?: string[]
  availableFrom?: string
  mobilityRadiusKm?: number
  mobilityNotes?: string
}

const FENCE = /^\s*```(?:json)?\s*([\s\S]*?)\s*```\s*$/

export function parseCommentIntake(raw: string): CommentIntakeAi {
  let json: unknown
  try {
    json = JSON.parse(FENCE.exec(raw)?.[1] ?? raw)
  } catch {
    throw new Error('AI_RESPONSE_NOT_JSON')
  }
  const { jobTitle, softwares, availableFrom, mobilityRadiusKm, mobilityNotes } =
    commentIntakeSchema.parse(json)
  return {
    ...(jobTitle ? { jobTitle } : {}),
    ...(softwares ? { softwares } : {}),
    ...(availableFrom ? { availableFrom } : {}),
    ...(mobilityRadiusKm ? { mobilityRadiusKm } : {}),
    ...(mobilityNotes ? { mobilityNotes } : {}),
  }
}
