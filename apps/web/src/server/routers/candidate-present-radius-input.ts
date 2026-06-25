import type { PresentCandidateRadiusInput } from '@/server/ai/present-candidate-radius-prompt'
import type { CandidateDocumentsProfile } from '@/server/routers/candidate-documents-input'

export function toPresentCandidateRadiusInput(
  profile: CandidateDocumentsProfile,
): PresentCandidateRadiusInput {
  return {
    candidate: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      jobTitleName: profile.jobTitle.name,
      softwareNames: profile.softwares.map((row) => row.software.name),
      city: profile.city,
      mobilityRadiusKm: profile.mobilityRadiusKm,
      mobilityNotes: profile.mobilityNotes,
      notes: profile.notes,
      cvSummary: profile.cvSummary,
    },
  }
}
