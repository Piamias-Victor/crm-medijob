'use client'

import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { PharmacyStatusBadge } from '@/components/molecules/PharmacyStatusBadge'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'

export const pharmacyTableColumns: ColumnDef<PharmacyListRow>[] = [
  { id: 'name', header: 'Nom', accessor: (row) => row.name, sortable: true },
  { id: 'city', header: 'Ville', accessor: (row) => row.city ?? TABLE_EMPTY_CELL, sortable: true },
  {
    id: 'groupementName',
    header: 'Groupement',
    accessor: (row) => row.groupementName ?? TABLE_EMPTY_CELL,
    sortable: true,
  },
  {
    id: 'status',
    header: 'Statut',
    accessor: (row) => row.status,
    sortable: true,
    cell: (row) => <PharmacyStatusBadge status={row.status} />,
  },
  {
    id: 'primaryContactName',
    header: 'Contact principal',
    accessor: (row) => row.primaryContactName ?? TABLE_EMPTY_CELL,
    sortable: true,
  },
  { id: 'missionCount', header: 'Nb missions', accessor: (row) => row.missionCount, sortable: true },
  {
    id: 'softwareName',
    header: 'LGO',
    accessor: (row) => row.softwareName ?? TABLE_EMPTY_CELL,
    sortable: true,
  },
]

export { PharmacyTableActions } from '@/components/organisms/pharmacy-table/pharmacy-table-actions'
