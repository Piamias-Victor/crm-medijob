'use client'

import { useCallback, useState } from 'react'
import { Building2 } from 'lucide-react'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { EntityViewShell } from '@/components/molecules/EntityViewShell'
import { PharmacyTable } from '@/components/organisms/pharmacy-table/pharmacy-table'
import { PharmacyMapView } from '@/components/organisms/PharmacyMapView'
import { PharmacyScrapePanel } from '@/components/organisms/PharmacyScrapePanel'
import { PharmaciesPageActions } from '@/components/organisms/pharmacies-page-actions'
import {
  PHARMACY_SCRAPE_DESCRIPTION,
  PHARMACY_SCRAPE_TITLE,
} from '@/lib/constants/pharmacy-scrape-copy'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { usePharmacyListQuery } from '@/lib/hooks/use-pharmacy-list-query'
import type { PharmacyFilterConfig } from '@/lib/filters/pharmacy-filter-config'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'
import type { PharmacyListFilters } from '@/view-models/pharmacy-list-filters.schema'
import { pharmacyViewOptions, type PharmacyView } from '@/components/molecules/ViewToggle'

type Props = {
  initialRows: PharmacyListRow[]
  serverFilters: PharmacyListFilters
  filterConfig: PharmacyFilterConfig
}

export function PharmaciesPage({ initialRows, serverFilters, filterConfig }: Props) {
  const [view, setView] = useState<PharmacyView>('list')
  const [sort, setSort] = useState<EntityTableSortState | null>(null)
  const [count, setCount] = useState(initialRows.length)
  const onCountChange = useCallback((next: number) => setCount(next), [])
  const { values, setFilters, reset, rows } = usePharmacyListQuery(
    initialRows,
    serverFilters,
    filterConfig,
    onCountChange,
  )

  return (
    <DashboardPage
      icon={<Building2 className="size-5" />}
      title="Pharmacies"
      description={`${count} officine(s) au portefeuille`}
      actions={<PharmaciesPageActions />}
    >
      <EntityViewShell
        view={view}
        onViewChange={setView}
        viewOptions={pharmacyViewOptions}
        panels={{
          list: {
            title: 'Portefeuille client',
            description: 'Officines, groupements, contacts et missions en cours.',
            content: (
              <PharmacyTable
                filterConfig={filterConfig}
                values={values}
                onChange={setFilters}
                onReset={reset}
                rows={rows}
                sort={sort}
                onSortChange={setSort}
              />
            ),
          },
          map: {
            title: 'Carte pharmacies',
            description: 'Filtrez Client / Prospect / Inactif pour localiser le portefeuille.',
            content: (
              <PharmacyMapView
                rows={rows}
                filterConfig={filterConfig}
                values={values}
                onChange={setFilters}
                onReset={reset}
              />
            ),
          },
          emails: {
            title: PHARMACY_SCRAPE_TITLE,
            description: PHARMACY_SCRAPE_DESCRIPTION,
            content: <PharmacyScrapePanel />,
          },
        }}
      />
    </DashboardPage>
  )
}
