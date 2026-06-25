import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { cvthequeExportColumnHeaders } from '@/view-models/cvtheque-export-columns'
import { cvthequeTableColumnIds, type CvthequeTableColumnId } from '@/view-models/cvtheque-export-column-ids'
import type { CandidateTableRow } from '@/view-models/candidate-list-vm'

export const cvthequeTableColumns: ColumnDef<CandidateTableRow>[] = cvthequeTableColumnIds.map((id) => ({
  id,
  header: cvthequeExportColumnHeaders[id],
  accessor: (row) => row[id as CvthequeTableColumnId],
  sortable: true,
}))

export { CvthequeTableActions } from '@/components/organisms/cvtheque-table/cvtheque-table-actions'
