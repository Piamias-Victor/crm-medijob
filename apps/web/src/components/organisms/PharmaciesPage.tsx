'use client'

import Link from 'next/link'
import { useCallback, useState } from 'react'
import { Building2, Plus, Upload } from 'lucide-react'
import { accentButtonClassName } from '@/lib/button-styles'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { EntityViewShell } from '@/components/molecules/EntityViewShell'
import { PharmacyTable } from '@/components/organisms/pharmacy-table/pharmacy-table'
import { PharmacyMapView } from '@/components/organisms/PharmacyMapView'
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
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/pharmacies/import"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface"
          >
            <Upload className="size-4" />
            Importer CSV
          </Link>
          <Link href="/pharmacies/new" className={accentButtonClassName}>
            <Plus className="size-4" />
            Nouvelle pharmacie
          </Link>
        </div>
      }
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
        }}
      />
    </DashboardPage>
  )
}
