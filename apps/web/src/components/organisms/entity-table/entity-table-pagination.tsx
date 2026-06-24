'use client'

import { TablePagination } from '@/components/molecules/table-pagination/table-pagination'

type Props = {
  page: number
  totalPages: number
  pageSize: number
  pageSizeOptions: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function EntityTablePagination(props: Props) {
  return <TablePagination {...props} />
}
