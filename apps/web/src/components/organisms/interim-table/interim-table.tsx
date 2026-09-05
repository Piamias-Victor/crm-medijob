'use client'

import { useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { EntityListFilterBar } from '@/components/organisms/entity-list-filter-bar/entity-list-filter-bar'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import type {
  ColumnDef,
  EntityTableSortState,
} from '@/components/organisms/entity-table/entity-table-types'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import type { FilterConfig, FilterValues } from '@/lib/filters/filter-types'

type Props<TRow extends { id: string }, TConfigs extends readonly FilterConfig[]> = {
  rows: TRow[]
  columns: ColumnDef<TRow>[]
  filterConfig: TConfigs
  matches: (row: TRow, values: FilterValues<TConfigs>) => boolean
  getRowHref?: (row: TRow) => string
  emptyIcon: LucideIcon
  emptyTitle: string
  emptyDescription: string
  syncUrl?: boolean
}

export function InterimTable<
  TRow extends { id: string },
  TConfigs extends readonly FilterConfig[],
>({
  rows,
  columns,
  filterConfig,
  matches,
  getRowHref,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  syncUrl = true,
}: Props<TRow, TConfigs>) {
  const { values, onChange, reset } = useEntityFilters(filterConfig, { syncUrl })
  const [sort, setSort] = useState<EntityTableSortState | null>(null)
  const filtered = useMemo(() => rows.filter((row) => matches(row, values)), [matches, rows, values])

  return (
    <div className="space-y-4">
      <EntityListFilterBar
        primary={[...filterConfig]}
        advanced={[]}
        values={values}
        onChange={onChange}
        onReset={reset}
        advancedCount={0}
      />
      <EntityTable
        rows={filtered}
        columns={columns}
        getRowId={(row) => row.id}
        getRowHref={getRowHref}
        emptyIcon={emptyIcon}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        sort={sort}
        onSortChange={setSort}
      />
    </div>
  )
}
