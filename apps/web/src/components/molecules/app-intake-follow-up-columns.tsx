import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

export function buildAppIntakeFollowUpColumns(): ColumnDef<AppProfileListItem>[] {
  return [
    { id: 'phone', header: 'Téléphone', accessor: (row) => row.phone ?? TABLE_EMPTY_CELL },
    { id: 'firstName', header: 'Prénom', accessor: (row) => row.firstName, sortable: true },
    { id: 'lastName', header: 'Nom', accessor: (row) => row.lastName, sortable: true },
    { id: 'email', header: 'Email', accessor: (row) => row.email ?? TABLE_EMPTY_CELL },
    {
      id: 'metier',
      header: 'Métier',
      accessor: (row) => row.jobTitleName ?? row.activityLabel ?? TABLE_EMPTY_CELL,
    },
    { id: 'city', header: 'Ville', accessor: (row) => row.city ?? TABLE_EMPTY_CELL },
    {
      id: 'postalCode',
      header: 'CP',
      accessor: (row) => row.postalCode ?? TABLE_EMPTY_CELL,
    },
    {
      id: 'enrolledAt',
      header: 'Inscrit le',
      accessor: (row) => new Date(row.createdAt).toLocaleDateString('fr-FR'),
      sortable: true,
    },
  ]
}
