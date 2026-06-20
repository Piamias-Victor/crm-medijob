import { parseMatchingScoreResponse } from '@/server/ai/matching.schema'
import { buildMatchingPrompt } from '@/server/ai/matching-prompt'
import type { AssistantProvider } from '@/server/ai/provider'
import type { MatchingCandidateInput, MatchingMissionInput } from '@/server/matching/matching-input.types'

const MAX_SCORED = 20

export type MatchingMissionContext = MatchingMissionInput & {
  title: string
  jobTitleName: string
  pharmacyName: string
  description: string | null
}

export async function scoreMatchingCandidates(
  mission: MatchingMissionContext,
  candidates: MatchingCandidateInput[],
  provider: AssistantProvider,
) {
  const batch = candidates.slice(0, MAX_SCORED)
  if (batch.length === 0) return []

  const prompt = buildMatchingPrompt(mission, batch)
  const raw = await provider.complete({ prompt, kind: 'matching' })
  const parsed = parseMatchingScoreResponse(raw)
  const allowed = new Set(batch.map((c) => c.id))
  return parsed
    .filter((row) => allowed.has(row.candidateId))
    .sort((a, b) => b.score - a.score)
}
