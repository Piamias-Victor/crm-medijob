'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/atoms/Button'

type Props = {
  page: number
  totalPages: number
  pageSize: number
  pageSizeOptions: number[]
  pageSizeControl?: ReactNode
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function TablePagination({
  page,
  totalPages,
  pageSizeControl,
  onPageChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-3 py-2">
      <div className="flex items-center gap-2 text-sm text-fg-muted">
        <span>Lignes par page</span>
        {pageSizeControl}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-fg-muted">
          Page {page} / {totalPages}
        </span>
        <Button
          type="button"
          variant="ghost"
          className="px-2"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Page précédente"
        >
          <ChevronLeft className="size-4" />
          Précédent
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="px-2"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Page suivante"
        >
          Suivant
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
