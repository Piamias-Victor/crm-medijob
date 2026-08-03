'use client'

import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { MissionStatusBadge } from '@/components/molecules/MissionStatusBadge'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { CONTRACT_TYPE_LABELS } from '@/lib/candidate-options'
import type { MissionListRow } from '@/view-models/mission-list'

export const missionTableColumns: ColumnDef<MissionListRow>[] = [
  { id: 'title', header: 'Intitulé', accessor: (row) => row.title, sortable: true },
  {
    id: 'jobTitle',
    header: 'Métier',
    accessor: (row) => row.jobTitle ?? TABLE_EMPTY_CELL,
    sortable: true,
  },
  {
    id: 'contractType',
    header: 'Contrat',
    accessor: (row) => CONTRACT_TYPE_LABELS[row.contractType],
    sortable: true,
  },
  {
    id: 'pharmacyName',
    header: 'Pharmacie',
    accessor: (row) => row.pharmacyName,
    sortable: true,
  },
  {
    id: 'city',
    header: 'Ville',
    accessor: (row) => row.city ?? TABLE_EMPTY_CELL,
    sortable: true,
  },
  {
    id: 'status',
    header: 'Statut',
    accessor: (row) => row.status,
    sortable: true,
    cell: (row) => <MissionStatusBadge status={row.status} className="px-2 py-0 text-[11px]" />,
  },
  {
    id: 'referent',
    header: 'Référent',
    accessor: (row) => row.referent ?? TABLE_EMPTY_CELL,
    sortable: true,
  },
  {
    id: 'createdAtLabel',
    header: 'Date création',
    accessor: (row) => row.createdAtLabel,
    sortable: true,
  },
]

export { MissionTableActions } from '@/components/organisms/mission-table/mission-table-actions'
