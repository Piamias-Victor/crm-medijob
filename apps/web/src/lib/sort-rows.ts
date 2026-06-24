export type SortDirection = 'asc' | 'desc'

export type SortableCell = string | number | Date | null | undefined

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}/

function isNullish(value: SortableCell): value is null | undefined {
  return value === null || value === undefined
}

function toSortable(value: SortableCell): number | string {
  if (value instanceof Date) return value.getTime()
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    if (!Number.isNaN(parsed) && ISO_DATE_RE.test(value)) return parsed
    return value
  }
  return String(value)
}

export function compareSortableValues(
  left: SortableCell,
  right: SortableCell,
  direction: SortDirection,
): number {
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

export function sortRowsByAccessor<TRow>(
  rows: TRow[],
  accessor: (row: TRow) => SortableCell,
  direction: SortDirection,
): TRow[] {
  return [...rows].sort((left, right) => compareSortableValues(accessor(left), accessor(right), direction))
}
