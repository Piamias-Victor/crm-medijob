'use client'

import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { Building2, Plus } from 'lucide-react'
import { accentButtonClassName } from '@/lib/button-styles'
import { EntityListPageShell } from '@/components/molecules/EntityListPageShell'
import { PharmacyTable } from '@/components/organisms/pharmacy-table/pharmacy-table'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { usePharmacyListQuery } from '@/lib/hooks/use-pharmacy-list-query'
import type { PharmacyFilterConfig } from '@/lib/filters/pharmacy-filter-config'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'
import type { PharmacyListFilters } from '@/view-models/pharmacy-list-filters.schema'

type Props = {
  initialRows: PharmacyListRow[]
  serverFilters: PharmacyListFilters
  filterConfig: PharmacyFilterConfig
}

export function PharmaciesPage({ initialRows, serverFilters, filterConfig }: Props) {
  const [sort, setSort] = useState<EntityTableSortState | null>(null)
  const [count, setCount] = useState(initialRows.length)
  const onCountChange = useCallback((next: number) => setCount(next), [])
  const { values, setFilters, reset, rows } = usePharmacyListQuery(
    initialRows,
    serverFilters,
    filterConfig,
    onCountChange,
  )
  const description = useMemo(() => `${count} officine(s) au portefeuille`, [count])

  return (
    <EntityListPageShell
      icon={<Building2 className="size-5" />}
      title="Pharmacies"
      description={description}
      sectionTitle="Portefeuille client"
      sectionDescription="Officines, groupements, contacts et missions en cours."
      action={
        <Link href="/pharmacies/new" className={accentButtonClassName}>
          <Plus className="size-4" />
          Nouvelle pharmacie
        </Link>
      }
    >
      <PharmacyTable
        filterConfig={filterConfig}
        values={values}
        onChange={setFilters}
        onReset={reset}
        rows={rows}
        sort={sort}
        onSortChange={setSort}
      />
    </EntityListPageShell>
  )
}
