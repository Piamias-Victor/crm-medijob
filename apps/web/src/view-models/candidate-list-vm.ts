import type { RawCandidate } from '@/view-models/candidate-kanban.types'
import { formatDateFr } from '@/view-models/format-date-fr'

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

export function candidateDepartment(postalCode: string | null): string | null {
  const code = postalCode?.trim()
  if (!code || code.length < 2) return null
  return code.slice(0, 2)
}

export function formatCandidateAvailability(availableFrom: Date | null, now = new Date()): string {
  if (!availableFrom) return 'Dès que possible'
  if (availableFrom.getTime() <= now.getTime()) return 'Immédiate'
  return formatDateFr(availableFrom)
}

export function toCandidateTableRow(candidate: RawCandidate, now = new Date()): CandidateTableRow {
  return {
    id: candidate.id,
    lastName: candidate.lastName,
    firstName: candidate.firstName,
    jobTitle: candidate.jobTitle?.name ?? null,
    city: candidate.city,
    department: candidateDepartment(candidate.postalCode),
    referent: candidate.referent?.name ?? null,
    availability: formatCandidateAvailability(candidate.availableFrom, now),
  }
}

export function toCandidateTableRows(candidates: RawCandidate[], now = new Date()): CandidateTableRow[] {
  return candidates.map((candidate) => toCandidateTableRow(candidate, now))
}
