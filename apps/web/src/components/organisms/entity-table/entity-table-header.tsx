'use client'

import { TableSortHeader } from '@/components/molecules/table-sort-header/table-sort-header'
import type { ColumnDef, EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'

type Props<TRow> = {
  columns: ColumnDef<TRow>[]
  sort: EntityTableSortState | null | undefined
  onSort: (columnId: string) => void
  hasActions: boolean
}

function ariaSortValue(sort: EntityTableSortState | null | undefined, columnId: string) {
  if (sort?.columnId !== columnId) return 'none' as const
  return sort.direction === 'asc' ? ('ascending' as const) : ('descending' as const)
}

export function EntityTableHeader<TRow>({ columns, sort, onSort, hasActions }: Props<TRow>) {
  return (
    <thead className="border-b border-border/80 bg-gradient-to-r from-primary-muted/80 via-primary-muted/50 to-accent-muted/70">
      <tr>
        {columns.map((column) => (
          <th
            key={column.id}
            scope="col"
            aria-sort={column.sortable ? ariaSortValue(sort, column.id) : undefined}
            className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-primary"
          >
            <TableSortHeader
              label={column.header}
              sortable={column.sortable}
              direction={sort?.columnId === column.id ? sort.direction : null}
              onSort={() => onSort(column.id)}
            />
          </th>
        ))}
        {hasActions ? (
          <th
            scope="col"
            className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-accent-hover"
          >
            Actions
          </th>
        ) : null}
      </tr>
    </thead>
  )
}
