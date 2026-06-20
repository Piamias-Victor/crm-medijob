import { DEFAULT_MOBILITY_RADIUS_KM } from '@/view-models/candidate-profile'
import type { ExclusionReasonCode } from '@/server/matching/exclusion-reasons'
import { haversineKm, type GeoLookup } from '@/server/matching/distance'
import type { MatchingCandidateInput, MatchingMissionInput } from '@/server/matching/matching-input.types'

export type PrefilterExcluded = {
  candidateId: string
  candidate: MatchingCandidateInput
  reasons: ExclusionReasonCode[]
}

export type PrefilterResult = {
  eligible: MatchingCandidateInput[]
  excluded: PrefilterExcluded[]
}

function hasGeo(city: string | null, postalCode: string | null) {
  return Boolean(city?.trim() && postalCode?.trim())
}

function jobTitleScore(scores: Map<string, number>, candidateJobTitleId: string) {
  return scores.get(candidateJobTitleId) ?? 0
}

export async function prefilterCandidates(
  mission: MatchingMissionInput,
  candidates: MatchingCandidateInput[],
  compatScores: Map<string, number>,
  lookupGeo: GeoLookup,
): Promise<PrefilterResult> {
  const pharmacyGeoOk = hasGeo(mission.pharmacyCity, mission.pharmacyPostalCode)
  const pharmacyCoords = pharmacyGeoOk
    ? await lookupGeo(mission.pharmacyPostalCode!.trim())
    : null

  const eligible: MatchingCandidateInput[] = []
  const excluded: PrefilterExcluded[] = []

  for (const candidate of candidates) {
    const reasons: ExclusionReasonCode[] = []

    if (jobTitleScore(compatScores, candidate.jobTitleId) <= 0) reasons.push('job_title')

    if (!hasGeo(candidate.city, candidate.postalCode) || !pharmacyGeoOk) {
      reasons.push('geo')
    } else if (!pharmacyCoords) {
      reasons.push('geo')
    } else {
      const candidateCoords = await lookupGeo(candidate.postalCode!.trim())
      if (!candidateCoords) {
        reasons.push('geo')
      } else {
        const radius = candidate.mobilityRadiusKm ?? DEFAULT_MOBILITY_RADIUS_KM
        const km = haversineKm(candidateCoords, pharmacyCoords)
        if (km > radius) reasons.push('distance')
      }
    }

    if (
      candidate.preferredContractTypes.length > 0 &&
      !candidate.preferredContractTypes.includes(mission.contractType)
    ) {
      reasons.push('contract')
    }

    if (candidate.availableFrom && candidate.availableFrom > mission.startDate) {
      reasons.push('availability')
    }

    if (reasons.length > 0) excluded.push({ candidateId: candidate.id, candidate, reasons })
    else eligible.push(candidate)
  }

  return { eligible, excluded }
}
