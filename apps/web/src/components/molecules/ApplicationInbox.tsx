'use client'

import { Inbox } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { formatInboxDate, type InboxItem } from '@/view-models/application-inbox'

const columns: ColumnDef<InboxItem>[] = [
  {
    id: 'lastName',
    header: 'Nom',
    accessor: (row) => row.lastName,
    sortable: true,
  },
  {
    id: 'firstName',
    header: 'Prénom',
    accessor: (row) => row.firstName,
    sortable: true,
  },
  {
    id: 'jobOffer',
    header: 'Offre',
    accessor: (row) => row.jobOffer.title,
    sortable: true,
  },
  {
    id: 'email',
    header: 'Email',
    accessor: (row) => row.email,
    sortable: true,
  },
  {
    id: 'city',
    header: 'Ville',
    accessor: (row) => row.city ?? TABLE_EMPTY_CELL,
    sortable: true,
  },
  {
    id: 'createdAt',
    header: 'Reçue le',
    accessor: (row) => formatInboxDate(row.createdAt),
    sortable: true,
  },
  {
    id: 'status',
    header: 'Statut',
    accessor: () => 'En attente',
    cell: () => (
      <Badge variant="warning" className="px-2 py-0 text-[11px]">
        En attente
      </Badge>
    ),
  },
]

export function ApplicationInbox({ items }: { items: InboxItem[] }) {
  return (
    <EntityTable
      rows={items}
      columns={columns}
      getRowId={(row) => row.id}
      emptyIcon={Inbox}
      emptyTitle="Boîte de réception vide"
      emptyDescription="Les candidatures Webflow apparaîtront ici dès leur réception."
    />
  )
}
