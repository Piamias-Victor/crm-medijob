'use client'

import { Badge } from '@/components/atoms/Badge'
import { cvthequeTableColumns } from '@/components/organisms/cvtheque-table/cvtheque-table-columns'
import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import type { CandidateTableRow } from '@/view-models/candidate-list-vm'

const NO_DECLARATION = 'Aucune dispo'

export function interimCandidateColumns(
  declaredById: Map<string, string>,
): ColumnDef<CandidateTableRow>[] {
  return [
    ...cvthequeTableColumns,
    {
      id: 'declaredAvailability',
      header: 'Dispos déclarées',
      accessor: (row) => declaredById.get(row.id) ?? NO_DECLARATION,
      sortable: true,
      cell: (row) => {
        const label = declaredById.get(row.id)
        return label ? (
          <Badge variant="success">{label}</Badge>
        ) : (
          <Badge variant="default">{NO_DECLARATION}</Badge>
        )
      },
    },
  ]
}
