import type { CellValue, ColumnDef, SortDirection } from '@/components/organisms/entity-table/entity-table-types'
import { sortRowsByAccessor } from '@/lib/sort-rows'

export function sortEntityRows<TRow>(
  rows: TRow[],
  columns: ColumnDef<TRow>[],
  columnId: string,
  direction: SortDirection,
): TRow[] {
  const column = columns.find((entry) => entry.id === columnId)
  if (!column) return [...rows]
  return sortRowsByAccessor(rows, (row) => column.accessor(row) as CellValue, direction)
}

type PaginationResult<TRow> = {
  rows: TRow[]
  totalPages: number
  page: number
}

export function paginateEntityRows<TRow>(rows: TRow[], page: number, pageSize: number): PaginationResult<TRow> {
  const safePageSize = Math.max(pageSize, 1)
  const totalPages = Math.max(1, Math.ceil(rows.length / safePageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const start = (safePage - 1) * safePageSize

  return {
    rows: rows.slice(start, start + safePageSize),
    totalPages,
    page: safePage,
  }
}
