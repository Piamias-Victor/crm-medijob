'use client'

import { Megaphone } from 'lucide-react'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { jobOfferColumns } from '@/components/organisms/job-offer-table/job-offer-columns'
import { JobOfferRowActions } from '@/components/organisms/job-offer-table/job-offer-row-actions'
import type { JobOfferListRow } from '@/view-models/job-offer-list'

type Props = {
  rows: JobOfferListRow[]
  sort: EntityTableSortState | null
  onSortChange: (sort: EntityTableSortState | null) => void
}

export function JobOfferTable({ rows, sort, onSortChange }: Props) {
  return (
    <EntityTable
      rows={rows}
      columns={jobOfferColumns}
      getRowId={(row) => row.id}
      emptyIcon={Megaphone}
      emptyTitle="Aucune offre"
      emptyDescription="Générez une offre depuis l’onglet Offre d’une mission."
      sort={sort}
      onSortChange={onSortChange}
      getRowHref={(row) => `/missions/${row.missionId}?tab=offre`}
      renderActions={(row) => <JobOfferRowActions row={row} />}
    />
  )
}
