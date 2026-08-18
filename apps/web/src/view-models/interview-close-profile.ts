import type { CloseSideEffectProfile } from '@/server/interview/close-side-effects'
import type { CandidateStatus } from '@/view-models/candidate-status'

export type CloseProfileSource = {
  status: string
  availableFrom: Date | null
  mobilityRadiusKm: number | null
  salaryExpectations: string | null
  notes: string | null
  cvSummary: string | null
  jobTitle: { name: string } | null
  softwares: { software: { name: string } }[]
  contractPreferences: { contractType: string }[]
}

export function toCloseProfile(row: CloseProfileSource): CloseSideEffectProfile {
  return {
    status: row.status as CandidateStatus,
    availableFrom: row.availableFrom,
    mobilityRadiusKm: row.mobilityRadiusKm,
    salaryExpectations: row.salaryExpectations,
    notes: row.notes,
    softwareNames: row.softwares.map((item) => item.software.name),
    contractTypes: row.contractPreferences.map((item) => item.contractType),
    cvSummary: row.cvSummary,
    jobTitleName: row.jobTitle?.name ?? '',
  }
}
