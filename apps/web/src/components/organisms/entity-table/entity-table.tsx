'use client'

import { EmptyState } from '@/components/atoms/EmptyState'
import { cn } from '@/lib/cn'
import { paginateEntityRows, sortEntityRows } from '@/components/organisms/entity-table/entity-table-logic'
import { EntityTableHeader } from '@/components/organisms/entity-table/entity-table-header'
import { EntityTablePagination } from '@/components/organisms/entity-table/entity-table-pagination'
import { EntityTableRow } from '@/components/organisms/entity-table/entity-table-row'
import { useEntityTableState } from '@/components/organisms/entity-table/entity-table-state'
import type { EntityTableProps } from '@/components/organisms/entity-table/entity-table-types'

const SCROLLBAR_ALWAYS =
  'overflow-x-scroll overflow-y-auto [scrollbar-gutter:stable] [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-surface'

export function EntityTable<TRow>({
  rows,
  columns,
  getRowId,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  renderActions,
  getRowHref,
  getRowStyle,
  onRowClick,
  pageSize,
  pageSizeOptions,
  sort: controlledSort,
  onSortChange,
  page: controlledPage,
  onPageChange,
  onPageSizeChange,
  scrollMaxHeightClassName,
}: EntityTableProps<TRow>) {
  const state = useEntityTableState<TRow>({
    pageSize,
    pageSizeOptions,
    sort: controlledSort,
    onSortChange,
    page: controlledPage,
    onPageChange,
    onPageSizeChange,
  })

  if (rows.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
  }

  const sortedRows = state.sort
    ? sortEntityRows(rows, columns, state.sort.columnId, state.sort.direction)
    : rows
  const pagination = paginateEntityRows(sortedRows, state.page, state.pageSize)
  const hasActions = Boolean(renderActions)

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className={cn(SCROLLBAR_ALWAYS, scrollMaxHeightClassName)}>
        <table className="min-w-max w-full border-collapse text-sm">
          <EntityTableHeader
            columns={columns}
            sort={state.sort}
            onSort={state.handleSort}
            hasActions={hasActions}
          />
          <tbody>
            {pagination.rows.map((row) => (
              <EntityTableRow
                key={getRowId(row)}
                row={row}
                columns={columns}
                hasActions={hasActions}
                renderActions={renderActions}
                getRowHref={getRowHref}
                getRowStyle={getRowStyle}
                onRowClick={onRowClick}
              />
            ))}
          </tbody>
        </table>
      </div>
      <EntityTablePagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        pageSize={state.pageSize}
        pageSizeOptions={state.pageSizeOptions}
        onPageChange={state.handlePageChange}
        onPageSizeChange={state.handlePageSizeChange}
      />
    </div>
  )
}
