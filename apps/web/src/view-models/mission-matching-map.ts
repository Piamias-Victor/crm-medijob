import type { CandidateMatchingRow } from '@/server/db/repositories/candidate-matching.select'
import type { MissionMatchingRow } from '@/server/db/repositories/mission-matching.select'
import type {
  MatchingCandidateInput,
  MatchingMissionInput,
} from '@/server/matching/matching-input.types'

export { toMissionMatchingPayload } from '@/view-models/mission-matching-payload'

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
