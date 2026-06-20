import { z } from 'zod'

export const matchingScoreItemSchema = z.object({
  candidateId: z.string().min(1),
  score: z.number().int().min(0).max(100),
  justification: z.string().min(1),
})

export const matchingScoreResponseSchema = z.array(matchingScoreItemSchema).min(1)

const matchingScoreWrapperSchema = z.object({
  scores: matchingScoreResponseSchema,
})

export type MatchingScoreItem = z.infer<typeof matchingScoreItemSchema>

function normalizeMatchingScoreJson(json: unknown): unknown {
  if (Array.isArray(json)) return json
  if (json && typeof json === 'object' && 'scores' in json) return (json as { scores: unknown }).scores
  return json
}

export function parseMatchingScoreResponse(raw: string): MatchingScoreItem[] {
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    throw new Error('AI_RESPONSE_NOT_JSON')
  }
  const normalized = normalizeMatchingScoreJson(json)
  const parsed = matchingScoreResponseSchema.safeParse(normalized)
  if (parsed.success) return parsed.data
  const wrapped = matchingScoreWrapperSchema.safeParse(json)
  if (wrapped.success) return wrapped.data.scores
  return matchingScoreResponseSchema.parse(normalized)
}
