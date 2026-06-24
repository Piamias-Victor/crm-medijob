'use client'

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { SortDirection } from '@/components/organisms/entity-table/entity-table-types'

type Props = {
  label: string
  sortable?: boolean
  direction?: SortDirection | null
  onSort?: () => void
}

export function TableSortHeader({ label, sortable, direction, onSort }: Props) {
  if (!sortable) return <span>{label}</span>

  const Icon = direction === 'asc' ? ArrowUp : direction === 'desc' ? ArrowDown : ArrowUpDown

  return (
    <button
      type="button"
      onClick={onSort}
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-left font-semibold text-inherit transition-[padding,background-color]',
        'hover:bg-white/50 hover:px-2.5 hover:py-1.5',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
      )}
      aria-label={`Trier par ${label}`}
    >
      {label}
      <Icon className="size-3.5 shrink-0" aria-hidden />
    </button>
  )
}
