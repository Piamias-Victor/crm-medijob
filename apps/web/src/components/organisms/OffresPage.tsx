'use client'

import { useMemo, useState } from 'react'
import { Megaphone } from 'lucide-react'
import { EntityListPageShell } from '@/components/molecules/EntityListPageShell'
import { JobOfferTable } from '@/components/organisms/job-offer-table/job-offer-table'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import type { JobOfferListRow } from '@/view-models/job-offer-list'

type Props = { initialRows: JobOfferListRow[] }

export function OffresPage({ initialRows }: Props) {
  const [sort, setSort] = useState<EntityTableSortState | null>(null)
  const description = useMemo(
    () => `${initialRows.length} offre(s) — brouillons et publications site.`,
    [initialRows.length],
  )

  return (
    <EntityListPageShell
      icon={<Megaphone className="size-5" />}
      title="Offres"
      description={description}
      sectionTitle="Annonces"
      sectionDescription="Offres générées depuis les missions — édition, publication et suivi des candidatures."
    >
      <JobOfferTable rows={initialRows} sort={sort} onSortChange={setSort} />
    </EntityListPageShell>
  )
}
