import {
  getMissingMatchingFields,
  isProfileIncompleteForMatching,
} from '@/view-models/candidate-profile'
import type { MatchingScoreItem } from '@/server/ai/matching.schema'
import type { CandidateMatchingRow } from '@/server/db/repositories/candidate-matching.select'
import { exclusionReasonLabel } from '@/server/matching/exclusion-reasons'
import type { MatchingCandidateInput } from '@/server/matching/matching-input.types'
import type { PrefilterResult } from '@/server/matching/prefilter'
import type { MissionMatchingPayload } from '@/view-models/mission-matching.types'

function profileFlags(row: CandidateMatchingRow) {
  const matching = {
    city: row.city,
    postalCode: row.postalCode,
    mobilityRadiusKm: row.mobilityRadiusKm,
    availableFrom: row.availableFrom,
  }
  return {
    isProfileIncomplete: isProfileIncompleteForMatching(matching),
    missingMatchingFields: getMissingMatchingFields(matching),
  }
}

export function toMissionMatchingPayload(
  candidatesById: Map<string, CandidateMatchingRow>,
  prefiltered: PrefilterResult,
  scores: MatchingScoreItem[],
): MissionMatchingPayload {
  const scoredIds = new Set(scores.map((score) => score.candidateId))
  const scored: MissionMatchingPayload['scored'] = []
  for (const score of scores) {
    const row = candidatesById.get(score.candidateId)
    if (!row) continue
    scored.push({
      candidateId: row.id,
      fullName: `${row.firstName} ${row.lastName}`,
      jobTitle: row.jobTitle.name,
      city: row.city,
      score: score.score,
      justification: score.justification,
      ...profileFlags(row),
    })
  }

  const excluded: MissionMatchingPayload['excluded'] = []
  for (const { candidate, reasons } of prefiltered.excluded) {
    const row = candidatesById.get(candidate.id)
    if (!row) continue
    excluded.push({
      candidateId: candidate.id,
      fullName: `${candidate.firstName} ${candidate.lastName}`,
      jobTitle: candidate.jobTitleName,
      city: candidate.city,
      reasons: reasons.map((code) => ({ code, label: exclusionReasonLabel(code) })),
      ...profileFlags(row),
    })
  }

  for (const candidate of prefiltered.eligible as MatchingCandidateInput[]) {
    if (scoredIds.has(candidate.id)) continue
    const row = candidatesById.get(candidate.id)
    if (!row) continue
    excluded.push({
      candidateId: candidate.id,
      fullName: `${candidate.firstName} ${candidate.lastName}`,
      jobTitle: candidate.jobTitleName,
      city: candidate.city,
      reasons: [{ code: 'not_scored', label: exclusionReasonLabel('not_scored') }],
      ...profileFlags(row),
    })
  }

  return { scored, excluded }
}
