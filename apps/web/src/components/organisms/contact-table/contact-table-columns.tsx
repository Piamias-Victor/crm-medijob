'use client'

import { Star } from 'lucide-react'
import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { ROLE_LABELS } from '@/lib/contact-options'
import type { ContactListRow } from '@/view-models/contact-list'

export const contactTableColumns: ColumnDef<ContactListRow>[] = [
  { id: 'fullName', header: 'Nom', accessor: (row) => row.fullName, sortable: true },
  {
    id: 'role',
    header: 'Rôle',
    accessor: (row) => ROLE_LABELS[row.role],
    sortable: true,
  },
  { id: 'pharmacyName', header: 'Pharmacie', accessor: (row) => row.pharmacyName, sortable: true },
  {
    id: 'phone',
    header: 'Téléphone',
    accessor: (row) => row.phone ?? TABLE_EMPTY_CELL,
    sortable: true,
  },
  {
    id: 'email',
    header: 'Email',
    accessor: (row) => row.email ?? TABLE_EMPTY_CELL,
    sortable: true,
  },
  {
    id: 'createdAtLabel',
    header: 'Date ajout',
    accessor: (row) => row.createdAtLabel,
    sortable: true,
  },
  {
    id: 'isPrimary',
    header: 'Badge principal',
    accessor: (row) => (row.isPrimary ? 'Principal' : TABLE_EMPTY_CELL),
    sortable: true,
    cell: (row) =>
      row.isPrimary ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-accent-muted px-2 py-0.5 text-[11px] font-medium text-accent-hover">
          <Star className="size-3" aria-hidden />
          Principal
        </span>
      ) : (
        TABLE_EMPTY_CELL
      ),
  },
  {
    id: 'city',
    header: 'Ville',
    accessor: (row) => row.city ?? TABLE_EMPTY_CELL,
    sortable: true,
  },
]

export { ContactTableActions } from '@/components/organisms/contact-table/contact-table-actions'
