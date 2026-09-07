import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'

export function mergeCandidateListWindowFilters(
  filters: CandidateListFilters,
  server: CandidateListFilters,
): CandidateListFilters {
  return {
    ...filters,
    ...(server.createdWithinHours != null
      ? { createdWithinHours: server.createdWithinHours }
      : {}),
    ...(server.validatedWithinHours != null
      ? { validatedWithinHours: server.validatedWithinHours }
      : {}),
  }
}
