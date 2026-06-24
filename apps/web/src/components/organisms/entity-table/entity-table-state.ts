'use client'

import { useState } from 'react'
import type { EntityTableProps, EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50]

export function useEntityTableState<TRow>({
  pageSize: initialPageSize = 25,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  sort: controlledSort,
  onSortChange,
  page: controlledPage,
  onPageChange,
  onPageSizeChange,
}: Pick<
  EntityTableProps<TRow>,
  'pageSize' | 'pageSizeOptions' | 'sort' | 'onSortChange' | 'page' | 'onPageChange' | 'onPageSizeChange'
>) {
  const [internalSort, setInternalSort] = useState<EntityTableSortState | null>(null)
  const [internalPage, setInternalPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const isSortControlled = controlledSort !== undefined
  const isPageControlled = controlledPage !== undefined
  const sort = isSortControlled ? controlledSort : internalSort
  const page = isPageControlled ? controlledPage : internalPage

  const handleSort = (columnId: string) => {
    const next: EntityTableSortState =
      sort?.columnId === columnId
        ? { columnId, direction: sort.direction === 'asc' ? 'desc' : 'asc' }
        : { columnId, direction: 'asc' }

    if (!isSortControlled) setInternalSort(next)
    onSortChange?.(next)
  }

  const handlePageChange = (nextPage: number) => {
    if (!isPageControlled) setInternalPage(nextPage)
    onPageChange?.(nextPage)
  }

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize)
    if (!isPageControlled) setInternalPage(1)
    else onPageChange?.(1)
    onPageSizeChange?.(nextPageSize)
  }

  return { sort, page, pageSize, pageSizeOptions, handleSort, handlePageChange, handlePageSizeChange }
}
