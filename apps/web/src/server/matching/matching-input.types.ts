export type MatchingCandidateInput = {
  id: string
  firstName: string
  lastName: string
  jobTitleId: string
  jobTitleName: string
  city: string | null
  postalCode: string | null
  mobilityRadiusKm: number | null
  availableFrom: Date | null
  preferredContractTypes: string[]
  salaryExpectations: string | null
  salaryMin: number | null
  salaryMax: number | null
}

export type MatchingMissionInput = {
  jobTitleId: string
  contractType: string
  startDate: Date
  pharmacyCity: string | null
  pharmacyPostalCode: string | null
}
