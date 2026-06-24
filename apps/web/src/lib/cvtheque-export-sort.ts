import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { cvthequeExportColumnIdSchema } from '@/view-models/cvtheque-export-column-ids'
import type { CandidateExportSort } from '@/view-models/candidate-export.schema'

export function toCandidateExportSort(sort: EntityTableSortState | null): CandidateExportSort | undefined {
  if (!sort) return undefined
  const parsed = cvthequeExportColumnIdSchema.safeParse(sort.columnId)
  if (!parsed.success) return undefined
  return { columnId: parsed.data, direction: sort.direction }
}
