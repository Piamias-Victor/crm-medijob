import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc'

export type CellValue = string | number | Date | null | undefined

export type ColumnDef<TRow> = {
  id: string
  header: string
  accessor: (row: TRow) => CellValue
  sortable?: boolean
  cell?: (row: TRow) => ReactNode
}

export type EntityTableSortState = {
  columnId: string
  direction: SortDirection
}

export type EntityTableProps<TRow> = {
  rows: TRow[]
  columns: ColumnDef<TRow>[]
  getRowId: (row: TRow) => string
  emptyIcon: LucideIcon
  emptyTitle: string
  emptyDescription: string
  renderActions?: (row: TRow) => ReactNode
  pageSize?: number
  pageSizeOptions?: number[]
  sort?: EntityTableSortState | null
  onSortChange?: (sort: EntityTableSortState | null) => void
  page?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}
