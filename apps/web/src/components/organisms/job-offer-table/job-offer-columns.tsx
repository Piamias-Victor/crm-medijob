import Link from 'next/link'
import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import type { JobOfferListRow } from '@/view-models/job-offer-list'
import { jobOfferStatusLabel } from '@/view-models/job-offer-status'

export const jobOfferColumns: ColumnDef<JobOfferListRow>[] = [
  {
    id: 'title',
    header: 'Titre',
    accessor: (row) => row.title,
    sortable: true,
  },
  {
    id: 'status',
    header: 'Statut',
    accessor: (row) => jobOfferStatusLabel(row.status),
    sortable: true,
    cell: (row) => (
      <span className="text-sm font-medium text-fg">{jobOfferStatusLabel(row.status)}</span>
    ),
  },
  {
    id: 'mission',
    header: 'Mission',
    accessor: (row) => row.missionTitle,
    sortable: true,
    cell: (row) => (
      <Link
        href={`/missions/${row.missionId}?tab=offre`}
        className="text-sm text-accent hover:underline"
        onClick={(event) => event.stopPropagation()}
      >
        {row.missionTitle}
      </Link>
    ),
  },
  {
    id: 'applications',
    header: 'Candidatures',
    accessor: (row) => row.applicationCount,
    sortable: true,
  },
  {
    id: 'publishedAt',
    header: 'Publication',
    accessor: (row) => row.publishedAt,
    sortable: true,
    cell: (row) =>
      row.publishedAt ? row.publishedAt.toLocaleDateString('fr-FR') : '—',
  },
]
