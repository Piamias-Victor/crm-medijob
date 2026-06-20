import { z } from 'zod'

export const candidateSearchInput = z.object({
  term: z.string().trim().min(1),
  limit: z.number().int().positive().max(20).optional(),
})

export type CandidateSearchRow = {
  id: string
  firstName: string
  lastName: string
  city: string | null
  postalCode: string | null
  jobTitle: { name: string } | null
}

export function toCandidateSearchOptions(rows: CandidateSearchRow[]) {
  return rows.map((row) => ({
    id: row.id,
    label: `${row.firstName} ${row.lastName}`.trim(),
    jobTitle: row.jobTitle?.name ?? null,
    city: row.city,
    postalCode: row.postalCode,
  }))
}
