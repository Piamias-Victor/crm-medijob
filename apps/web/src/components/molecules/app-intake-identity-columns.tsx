'use client'

import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { TruncatedText } from '@/components/molecules/TruncatedText'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { BADAKAN_COMMENTS_TITLE } from '@/view-models/badakan-comment'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

export function buildAppIntakeIdentityColumns(): ColumnDef<AppProfileListItem>[] {
  return [
    {
      id: 'phone',
      header: 'Téléphone',
      accessor: (row) => row.phone ?? TABLE_EMPTY_CELL,
      sortable: true,
      cell: (row) => <TruncatedText text={row.phone} className="max-w-[7.5rem]" />,
    },
    {
      id: 'firstName',
      header: 'Prénom',
      accessor: (row) => row.firstName,
      sortable: true,
      cell: (row) => <TruncatedText text={row.firstName} className="max-w-[7rem]" />,
    },
    {
      id: 'lastName',
      header: 'Nom',
      accessor: (row) => row.lastName,
      sortable: true,
      cell: (row) => <TruncatedText text={row.lastName} className="max-w-[7rem]" />,
    },
    {
      id: 'email',
      header: 'Email',
      accessor: (row) => row.email ?? TABLE_EMPTY_CELL,
      sortable: true,
      cell: (row) => <TruncatedText text={row.email} className="max-w-[10rem]" />,
    },
    {
      id: 'metier',
      header: 'Métier',
      accessor: (row) => row.jobTitleName ?? row.activityLabel ?? TABLE_EMPTY_CELL,
      sortable: true,
      cell: (row) => (
        <TruncatedText
          text={row.jobTitleName ?? row.activityLabel}
          className="max-w-[8rem]"
        />
      ),
    },
    {
      id: 'city',
      header: 'Ville',
      accessor: (row) => row.city ?? TABLE_EMPTY_CELL,
      sortable: true,
      cell: (row) => <TruncatedText text={row.city} className="max-w-[7rem]" />,
    },
    {
      id: 'postalCode',
      header: 'CP',
      accessor: (row) => row.postalCode ?? TABLE_EMPTY_CELL,
      sortable: true,
    },
    {
      id: 'enrolledAt',
      header: 'Inscrit le',
      accessor: (row) => new Date(row.createdAt).toLocaleDateString('fr-FR'),
      sortable: true,
    },
    {
      id: 'badakanComments',
      header: BADAKAN_COMMENTS_TITLE,
      accessor: (row) => row.badakanCommentsLabel,
      cell: (row) => (
        <span
          className="block min-w-[14rem] max-w-[22rem] whitespace-normal break-words line-clamp-3 text-xs leading-snug"
          title={row.badakanCommentsLabel}
        >
          {row.badakanCommentsLabel}
        </span>
      ),
    },
    {
      id: 'intakeBookingSms',
      header: 'SMS RDV',
      accessor: (row) => row.intakeBookingSmsLabel,
      sortable: true,
    },
  ]
}
