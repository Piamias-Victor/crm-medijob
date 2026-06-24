import type { RawCandidate } from '@/view-models/candidate-kanban.types'
import { buildCvthequeCoreFields } from '@/view-models/cvtheque-core-fields'

export type CandidateTableRow = {
  id: string
  lastName: string
  firstName: string
  jobTitle: string | null
  city: string | null
  department: string | null
  referent: string | null
  availability: string
}

export { candidateDepartment, formatCandidateAvailability } from '@/view-models/cvtheque-core-fields'

export function toCandidateTableRow(candidate: RawCandidate, now = new Date()): CandidateTableRow {
  return {
    id: candidate.id,
    ...buildCvthequeCoreFields(
      {
        lastName: candidate.lastName,
        firstName: candidate.firstName,
        city: candidate.city,
        postalCode: candidate.postalCode,
        availableFrom: candidate.availableFrom,
        jobTitle: candidate.jobTitle,
        referent: candidate.referent,
      },
      now,
    ),
  }
}

export function toCandidateTableRows(candidates: RawCandidate[], now = new Date()): CandidateTableRow[] {
  return candidates.map((candidate) => toCandidateTableRow(candidate, now))
}
