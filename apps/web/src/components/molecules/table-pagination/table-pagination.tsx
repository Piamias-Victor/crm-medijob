'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/atoms/Button'

type Props = {
  page: number
  totalPages: number
  pageSize: number
  pageSizeOptions: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function TablePagination({
  page,
  totalPages,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-3 py-2">
      <label className="flex items-center gap-2 text-sm text-fg-muted">
        Lignes par page
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-md border border-border bg-surface px-2 py-1 text-sm text-fg"
          aria-label="Nombre de lignes par page"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
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
