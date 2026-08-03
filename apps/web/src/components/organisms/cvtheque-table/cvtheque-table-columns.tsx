'use client'

import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { CandidateStatusBadge } from '@/components/molecules/CandidateStatusBadge'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import type { CandidateTableRow } from '@/view-models/candidate-list-vm'

export const cvthequeTableColumns: ColumnDef<CandidateTableRow>[] = [
  { id: 'lastName', header: 'Nom', accessor: (row) => row.lastName, sortable: true },
  { id: 'firstName', header: 'Prénom', accessor: (row) => row.firstName, sortable: true },
  {
    id: 'jobTitle',
    header: 'Métier',
    accessor: (row) => row.jobTitle ?? TABLE_EMPTY_CELL,
    sortable: true,
  },
  {
    id: 'status',
    header: 'Statut',
    accessor: (row) => row.status,
    sortable: true,
    cell: (row) => <CandidateStatusBadge status={row.status} />,
  },
  { id: 'city', header: 'Ville', accessor: (row) => row.city ?? TABLE_EMPTY_CELL, sortable: true },
  {
    id: 'department',
    header: 'Dpt',
    accessor: (row) => row.department ?? TABLE_EMPTY_CELL,
    sortable: true,
  },
  {
    id: 'createdAtLabel',
    header: "Date d'ajout",
    accessor: (row) => row.createdAtLabel,
    sortable: true,
  },
  {
    id: 'referent',
    header: 'Référent',
    accessor: (row) => row.referent ?? TABLE_EMPTY_CELL,
    sortable: true,
  },
  {
    id: 'availability',
    header: 'Disponibilité',
    accessor: (row) => row.availability,
    sortable: true,
  },
]

export { CvthequeTableActions } from '@/components/organisms/cvtheque-table/cvtheque-table-actions'
