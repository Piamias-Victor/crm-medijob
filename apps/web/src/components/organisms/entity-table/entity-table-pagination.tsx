'use client'

import { TablePagination } from '@/components/molecules/table-pagination/table-pagination'
import { TablePageSizeSelect } from '@/components/molecules/TablePageSizeSelect'

type Props = {
  page: number
  totalPages: number
  pageSize: number
  pageSizeOptions: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function EntityTablePagination(props: Props) {
  return (
    <TablePagination
      {...props}
      pageSizeControl={
        <TablePageSizeSelect
          value={props.pageSize}
          options={props.pageSizeOptions}
          onChange={props.onPageSizeChange}
        />
      }
    />
  )
}
