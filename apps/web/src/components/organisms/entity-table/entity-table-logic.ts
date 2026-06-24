import type { CellValue, ColumnDef, SortDirection } from '@/components/organisms/entity-table/entity-table-types'

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}/

function isNullish(value: CellValue): value is null | undefined {
  return value === null || value === undefined
}

function toSortable(value: CellValue): number | string {
  if (value instanceof Date) return value.getTime()
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    if (!Number.isNaN(parsed) && ISO_DATE_RE.test(value)) return parsed
    return value
  }
  return String(value)
}

function compareValues(left: CellValue, right: CellValue, direction: SortDirection): number {
  if (isNullish(left) && isNullish(right)) return 0
  if (isNullish(left)) return 1
  if (isNullish(right)) return -1

  const a = toSortable(left)
  const b = toSortable(right)
  const base =
    typeof a === 'number' && typeof b === 'number'
      ? a - b
      : String(a).localeCompare(String(b), 'fr', { sensitivity: 'base' })

  return direction === 'asc' ? base : -base
}

export function sortEntityRows<TRow>(
  rows: TRow[],
  columns: ColumnDef<TRow>[],
  columnId: string,
  direction: SortDirection,
): TRow[] {
  const column = columns.find((entry) => entry.id === columnId)
  if (!column) return [...rows]

  return [...rows].sort((left, right) =>
    compareValues(column.accessor(left), column.accessor(right), direction),
  )
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
