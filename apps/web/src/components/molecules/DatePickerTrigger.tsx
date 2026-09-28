'use client'

import { Calendar } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatDisplayDate } from '@/lib/date-picker-utils'

type Props = {
  id?: string
  ariaLabel?: string
  disabled?: boolean
  className?: string
  value?: string
  emptyLabel: string
  onToggle: () => void
}

export function DatePickerTrigger({
  id,
  ariaLabel,
  disabled,
  className,
  value,
  emptyLabel,
  onToggle,
}: Props) {
  return (
    <button
      id={id}
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'flex w-full items-center justify-between gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-fg outline-none transition-colors hover:border-accent focus:border-accent focus:ring-2 focus:ring-accent-muted disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
    >
      <span className={cn(!value && 'text-fg-muted')}>{formatDisplayDate(value, emptyLabel)}</span>
      <Calendar className="size-4 text-fg-muted" />
    </button>
  )
}
