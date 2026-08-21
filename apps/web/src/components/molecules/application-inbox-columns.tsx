import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { formatInboxDate, type InboxItem } from '@/view-models/application-inbox'

export function buildApplicationInboxColumns(): ColumnDef<InboxItem>[] {
  return [
    { id: 'lastName', header: 'Nom', accessor: (row) => row.lastName, sortable: true },
    { id: 'firstName', header: 'Prénom', accessor: (row) => row.firstName, sortable: true },
    {
      id: 'jobTitle',
      header: 'Métier',
      accessor: (row) => row.jobTitle?.name ?? TABLE_EMPTY_CELL,
      sortable: true,
    },
    { id: 'phone', header: 'Téléphone', accessor: (row) => row.phone ?? TABLE_EMPTY_CELL },
    { id: 'email', header: 'Email', accessor: (row) => row.email, sortable: true },
    { id: 'city', header: 'Ville', accessor: (row) => row.city ?? TABLE_EMPTY_CELL, sortable: true },
    {
      id: 'cv',
      header: 'CV',
      accessor: (row) => (row.cvUrl ? 'CV' : TABLE_EMPTY_CELL),
    },
    {
      id: 'jobOffer',
      header: 'Offre',
      accessor: (row) => row.jobOffer.title,
      sortable: true,
    },
    {
      id: 'createdAt',
      header: 'Reçue le',
      accessor: (row) => formatInboxDate(row.createdAt),
      sortable: true,
    },
    {
      id: 'message',
      header: 'Message',
      accessor: (row) => row.message ?? TABLE_EMPTY_CELL,
    },
  ]
}
