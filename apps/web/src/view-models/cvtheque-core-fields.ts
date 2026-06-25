import { formatDateFr } from '@/view-models/format-date-fr'

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

type CoreInput = {
  lastName: string
  firstName: string
  city: string | null
  postalCode: string | null
  availableFrom: Date | null
  jobTitle: { name: string } | null
  referent: { name: string } | null
}

export function buildCvthequeCoreFields(input: CoreInput, now = new Date()) {
  return {
    lastName: input.lastName,
    firstName: input.firstName,
    jobTitle: input.jobTitle?.name ?? null,
    city: input.city,
    department: candidateDepartment(input.postalCode),
    referent: input.referent?.name ?? null,
    availability: formatCandidateAvailability(input.availableFrom, now),
  }
}
