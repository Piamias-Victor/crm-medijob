import type { InterviewPdfIdentity } from '@/view-models/interview-pdf-snapshot'

type ProfileRow = {
  firstName: string
  lastName: string
  city: string | null
  jobTitle: { name: string }
  availableFrom: Date | null
  mobilityRadiusKm: number | null
  salaryExpectations: string | null
  notes: string | null
  softwares: { software: { name: string } }[]
  contractPreferences: { contractType: string }[]
}

export function toInterviewPdfIdentity(row: ProfileRow): Omit<InterviewPdfIdentity, 'referentName'> {
  return {
    firstName: row.firstName,
    lastName: row.lastName,
    city: row.city,
    jobTitleName: row.jobTitle.name,
    availableFrom: row.availableFrom,
    mobilityRadiusKm: row.mobilityRadiusKm,
    salaryExpectations: row.salaryExpectations,
    notes: row.notes,
    softwareNames: row.softwares.map((item) => item.software.name),
    contractTypes: row.contractPreferences.map((item) => item.contractType),
  }
}
