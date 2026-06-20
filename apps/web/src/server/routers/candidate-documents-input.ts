import type { CandidateSummaryInput } from '@/server/ai/candidate-summary'
import type { CandidateAnonymizedInput } from '@/server/ai/candidate-anonymized'

type SoftwareRow = { software: { name: string } }

export type CandidateDocumentsProfile = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  notes: string | null
  cvSummary: string | null
  anonymizedProfile: string | null
  jobTitle: { name: string }
  mobilityRadiusKm: number | null
  mobilityNotes: string | null
  availableFrom: Date | null
  softwares: SoftwareRow[]
}

function softwareNames(profile: CandidateDocumentsProfile): string[] {
  return profile.softwares.map((row) => row.software.name)
}

function piiTokens(profile: CandidateDocumentsProfile): string[] {
  return [profile.firstName, profile.lastName, profile.email, profile.phone, profile.address]
    .filter((value): value is string => Boolean(value?.trim()))
}

export function toSummaryInput(profile: CandidateDocumentsProfile): CandidateSummaryInput {
  return {
    notes: profile.notes,
    jobTitleName: profile.jobTitle.name,
    softwareNames: softwareNames(profile),
  }
}

export function toAnonymizedInput(profile: CandidateDocumentsProfile): CandidateAnonymizedInput {
  if (!profile.cvSummary?.trim()) throw new Error('CV_SUMMARY_REQUIRED')
  return {
    cvSummary: profile.cvSummary,
    jobTitleName: profile.jobTitle.name,
    softwareNames: softwareNames(profile),
    mobilityRadiusKm: profile.mobilityRadiusKm,
    mobilityNotes: profile.mobilityNotes,
    availableFrom: profile.availableFrom,
    forbiddenTokens: piiTokens(profile),
  }
}
