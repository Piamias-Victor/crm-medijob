import type { CandidateLike } from '@/server/ai/format-entity'
import { formatSalaryExpectations } from '@/view-models/format-salary-expectations'

export type CandidateContextRow = {
  firstName: string
  lastName: string
  city: string | null
  availableFrom: Date | null
  mobilityRadiusKm: number | null
  mobilityNotes: string | null
  cvSummary: string | null
  notes: string | null
  status: string
  salaryExpectations: string | null
  salaryMin: number | null
  salaryMax: number | null
  jobTitle: { name: string }
  softwares: { software: { name: string } }[]
  contractPreferences: { contractType: string }[]
}

export function mapCandidateForContext(row: CandidateContextRow): CandidateLike {
  return {
    firstName: row.firstName,
    lastName: row.lastName,
    city: row.city,
    availableFrom: row.availableFrom,
    mobilityRadiusKm: row.mobilityRadiusKm,
    mobilityNotes: row.mobilityNotes,
    cvSummary: row.cvSummary,
    notes: row.notes,
    status: row.status,
    jobTitleName: row.jobTitle.name,
    softwareNames: row.softwares.map((s) => s.software.name),
    preferredContractTypes: row.contractPreferences.map((c) => c.contractType),
    salaryExpectations: formatSalaryExpectations(row),
  }
}
