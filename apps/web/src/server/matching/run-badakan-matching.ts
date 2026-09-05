import type { AssistantProvider } from '@/server/ai/provider'
import { scoreMatchingCandidates } from '@/server/ai/matching-score'
import type { CandidateMatchingRow } from '@/server/db/repositories/candidate-matching.select'
import { createGeoLookup, type GeoLookup } from '@/server/matching/distance'
import { prefilterCandidates } from '@/server/matching/prefilter'
import { toMatchingCandidateInput } from '@/view-models/mission-matching-map'
import { toMissionMatchingPayload } from '@/view-models/mission-matching-payload'
import {
  toMatchingMissionFromBadakan,
  type BadakanMatchingSource,
} from '@/view-models/badakan-matching-map'
import { missionDateRange } from '@/view-models/badakan-matching-dates'

type CompatRow = { candidateJobTitleId: string; score: number }

export type BadakanMatchingDeps = {
  findMission: (id: string) => Promise<BadakanMatchingSource | null>
  listCandidates: (range: { from: string; to: string }) => Promise<CandidateMatchingRow[]>
  listCompatibilities: (missionJobTitleId: string) => Promise<CompatRow[]>
  provider: AssistantProvider
  lookupGeo?: GeoLookup
}

export async function runBadakanMissionMatching(missionId: string, deps: BadakanMatchingDeps) {
  const mission = await deps.findMission(missionId)
  if (!mission) return null
  const context = toMatchingMissionFromBadakan(mission)
  const range = missionDateRange(mission.periods)
  if (!context || !range) return null

  const rows = await deps.listCandidates(range)
  const candidates = rows.map(toMatchingCandidateInput)
  const compatScores = new Map(
    (await deps.listCompatibilities(context.jobTitleId)).map((row) => [
      row.candidateJobTitleId,
      row.score,
    ]),
  )
  const prefiltered = await prefilterCandidates(
    context,
    candidates,
    compatScores,
    deps.lookupGeo ?? createGeoLookup(),
  )
  const scores = await scoreMatchingCandidates(context, prefiltered.eligible, deps.provider)
  return toMissionMatchingPayload(new Map(rows.map((row) => [row.id, row])), prefiltered, scores)
}
