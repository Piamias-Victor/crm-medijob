import {
  getMissingMatchingFields,
  isProfileIncompleteForMatching,
} from '@/view-models/candidate-profile'
import type { MatchingScoreItem } from '@/server/ai/matching.schema'
import type { CandidateMatchingRow } from '@/server/db/repositories/candidate-matching.select'
import type { MissionMatchingRow } from '@/server/db/repositories/mission-matching.select'
import { exclusionReasonLabel } from '@/server/matching/exclusion-reasons'
import type {
  MatchingCandidateInput,
  MatchingMissionInput,
} from '@/server/matching/matching-input.types'
import type { PrefilterResult } from '@/server/matching/prefilter'
import type { MissionMatchingPayload } from '@/view-models/mission-matching.types'

export function toMatchingCandidateInput(row: CandidateMatchingRow): MatchingCandidateInput {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    jobTitleId: row.jobTitleId,
    jobTitleName: row.jobTitle.name,
    city: row.city,
    postalCode: row.postalCode,
    mobilityRadiusKm: row.mobilityRadiusKm,
    availableFrom: row.availableFrom,
    preferredContractTypes: row.contractPreferences.map((pref) => pref.contractType),
  }
}

export function toMatchingMissionInput(row: MissionMatchingRow): MatchingMissionInput {
  return {
    jobTitleId: row.jobTitleId,
    contractType: row.contractType,
    startDate: row.startDate,
    pharmacyCity: row.pharmacy.city,
    pharmacyPostalCode: row.pharmacy.postalCode,
  }
}

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
  const scored = scores.map((score) => {
    const row = candidatesById.get(score.candidateId)!
    return {
      candidateId: row.id,
      fullName: `${row.firstName} ${row.lastName}`,
      jobTitle: row.jobTitle.name,
      city: row.city,
      score: score.score,
      justification: score.justification,
      ...profileFlags(row),
    }
  })

  const excluded = prefiltered.excluded.map(({ candidate, reasons }) => {
    const row = candidatesById.get(candidate.id)!
    return {
      candidateId: candidate.id,
      fullName: `${candidate.firstName} ${candidate.lastName}`,
      jobTitle: candidate.jobTitleName,
      city: candidate.city,
      reasons: reasons.map((code) => ({ code, label: exclusionReasonLabel(code) })),
      ...profileFlags(row),
    }
  })

  return { scored, excluded }
}
