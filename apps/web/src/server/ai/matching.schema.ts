import { z } from 'zod'

export const matchingScoreItemSchema = z.object({
  candidateId: z.string().min(1),
  score: z.number().int().min(0).max(100),
  justification: z.string().min(1),
})

export const matchingScoreResponseSchema = z.array(matchingScoreItemSchema).min(1)

export type MatchingScoreItem = z.infer<typeof matchingScoreItemSchema>

export function parseMatchingScoreResponse(raw: string): MatchingScoreItem[] {
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    throw new Error('AI_RESPONSE_NOT_JSON')
  }
  return matchingScoreResponseSchema.parse(json)
}
