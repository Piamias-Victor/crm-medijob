import type { PresentCandidateInput } from '@/server/ai/present-candidate'
import type { CandidateDocumentsProfile } from '@/server/routers/candidate-documents-input'
import type { PharmacyLike } from '@/server/ai/format-entity'

export function toPresentCandidateInput(
  profile: CandidateDocumentsProfile,
  pharmacy: PharmacyLike,
): PresentCandidateInput {
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
    pharmacy,
  }
}
