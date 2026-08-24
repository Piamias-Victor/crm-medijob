'use client'

import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { FinanceLineMarksCell } from '@/components/molecules/FinanceLineMarksCell'
import { Badge } from '@/components/atoms/Badge'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

export const facturationLineStatusColumns: ColumnDef<FacturationSuiviRow>[] = [
  {
    id: 'lineStatus',
    header: 'Statut',
    accessor: (row) => (row.cancelled ? 'Annulé' : 'Actif'),
    sortable: true,
    cell: (row) =>
      row.financeLineId ? (
        <Badge variant={row.cancelled ? 'error' : 'success'} className="px-2 py-0 text-[11px]">
          {row.cancelled ? 'Annulé' : 'Actif'}
        </Badge>
      ) : null,
  },
  {
    id: 'marks',
    header: 'Facturé / Encaissé',
    accessor: (row) => `${row.invoiced ? 1 : 0}${row.paid ? 1 : 0}`,
    cell: (row) => (row.financeLineId ? <FinanceLineMarksCell row={row} /> : null),
  },
]
