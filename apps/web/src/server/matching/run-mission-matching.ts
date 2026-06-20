import type { AssistantProvider } from '@/server/ai/provider'
import { scoreMatchingCandidates, type MatchingMissionContext } from '@/server/ai/matching-score'
import type { CandidateMatchingRow } from '@/server/db/repositories/candidate-matching.select'
import type { MissionMatchingRow } from '@/server/db/repositories/mission-matching.select'
import { createGeoLookup, type GeoLookup } from '@/server/matching/distance'
import { prefilterCandidates } from '@/server/matching/prefilter'
import {
  toMatchingCandidateInput,
  toMatchingMissionInput,
  toMissionMatchingPayload,
} from '@/view-models/mission-matching-map'

type CompatRow = { candidateJobTitleId: string; score: number }

export type MissionMatchingDeps = {
  findMission: (id: string) => Promise<MissionMatchingRow | null>
  listCandidates: () => Promise<CandidateMatchingRow[]>
  listCompatibilities: (missionJobTitleId: string) => Promise<CompatRow[]>
  provider: AssistantProvider
  lookupGeo?: GeoLookup
}

export async function runMissionMatching(missionId: string, deps: MissionMatchingDeps) {
  const mission = await deps.findMission(missionId)
  if (!mission) return null

  const rows = await deps.listCandidates()
  const candidates = rows.map(toMatchingCandidateInput)
  const compatScores = new Map(
    (await deps.listCompatibilities(mission.jobTitleId)).map((row) => [
      row.candidateJobTitleId,
      row.score,
    ]),
  )

  const prefiltered = await prefilterCandidates(
    toMatchingMissionInput(mission),
    candidates,
    compatScores,
    deps.lookupGeo ?? createGeoLookup(),
  )

  const missionContext: MatchingMissionContext = {
    ...toMatchingMissionInput(mission),
    title: mission.title,
    jobTitleName: mission.jobTitle.name,
    pharmacyName: mission.pharmacy.name,
    description: mission.description,
  }

  const scores = await scoreMatchingCandidates(
    missionContext,
    prefiltered.eligible,
    deps.provider,
  )

  return toMissionMatchingPayload(new Map(rows.map((row) => [row.id, row])), prefiltered, scores)
}
