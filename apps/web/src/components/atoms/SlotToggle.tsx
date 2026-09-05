'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

type Props = {
  label: string
  selected: boolean
  disabled?: boolean
  readOnly?: boolean
  onClick?: () => void
}

export function SlotToggle({ label, selected, disabled, readOnly, onClick }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled || readOnly}
      onClick={onClick}
      className={cn(
        'flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border px-2 text-sm font-medium transition-colors',
        selected
          ? 'border-accent-hover bg-accent text-accent-fg'
          : 'border-border bg-white text-fg-muted active:bg-surface',
        disabled && 'cursor-not-allowed border-dashed opacity-40',
        readOnly && !disabled && 'cursor-default',
      )}
    >
      {selected ? <Check aria-hidden className="size-4" /> : null}
      {label}
    </button>
  )
}
