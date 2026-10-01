'use client'

import { useCallback, useMemo, useState } from 'react'
import { Megaphone, Plus } from 'lucide-react'
import { accentButtonClassName } from '@/lib/button-styles'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { EntityViewShell } from '@/components/molecules/EntityViewShell'
import { JobOfferFilterBar } from '@/components/organisms/job-offer-table/job-offer-filter-bar'
import { JobOfferTable } from '@/components/organisms/job-offer-table/job-offer-table'
import { JobOfferMapView } from '@/components/organisms/JobOfferMapView'
import { OffresPageCreate } from '@/components/organisms/offres-page-create'
import { useJobOfferListQuery } from '@/lib/hooks/use-job-offer-list-query'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import type { JobOfferListRow } from '@/view-models/job-offer-list'
import type { JobOfferListFilters } from '@/view-models/job-offer-list-filters.schema'
import type { JobOfferFilterConfig } from '@/lib/filters/job-offer-filter-config'
import { CREATE_OFFER_LABEL } from '@/view-models/mission-offer-picker'
import { pharmacyViewOptions, type PharmacyView } from '@/components/molecules/ViewToggle'

type Props = {
  initialRows: JobOfferListRow[]
  serverFilters: JobOfferListFilters
  filterConfig: JobOfferFilterConfig
}

export function OffresPage({ initialRows, serverFilters, filterConfig }: Props) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<PharmacyView>('list')
  const [sort, setSort] = useState<EntityTableSortState | null>(null)
  const [count, setCount] = useState(initialRows.length)
  const onCountChange = useCallback((next: number) => setCount(next), [])
  const { values, setFilters, reset, rows } = useJobOfferListQuery(
    initialRows,
    serverFilters,
    filterConfig,
    onCountChange,
  )
  const description = useMemo(
    () => `${count} offre(s) — brouillons et publications site.`,
    [count],
  )

  return (
    <DashboardPage
      icon={<Megaphone className="size-5" />}
      title="Offres"
      description={description}
      actions={
        <button type="button" className={accentButtonClassName} onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          {CREATE_OFFER_LABEL}
        </button>
      }
    >
      <div className="space-y-4">
        <JobOfferFilterBar
          filterConfig={filterConfig}
          values={values}
          onChange={setFilters}
          onReset={reset}
        />
        <EntityViewShell
          view={view}
          onViewChange={setView}
          viewOptions={pharmacyViewOptions}
          panels={{
            list: {
              title: 'Annonces',
              description: 'Offres liées et sans mission — édition, publication, candidatures.',
              content: <JobOfferTable rows={rows} sort={sort} onSortChange={setSort} />,
            },
            map: {
              title: 'Carte offres',
              description: 'Même filtres que la liste. Couches pharmacies, candidats, missions.',
              content: <JobOfferMapView rows={rows} />,
            },
          }}
        />
      </div>
      <OffresPageCreate open={open} onOpenChange={setOpen} />
    </DashboardPage>
  )
}
