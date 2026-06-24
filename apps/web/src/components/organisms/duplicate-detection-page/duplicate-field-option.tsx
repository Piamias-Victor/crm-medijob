'use client'

import { cn } from '@/lib/cn'
import { type DuplicateFieldOptionProps } from '@/components/organisms/duplicate-detection-page/duplicate-detection-types'

export function DuplicateFieldOption({
  name,
  selected,
  label,
  onSelect,
  children,
}: DuplicateFieldOptionProps) {
  return (
    <label
      className={cn(
        'flex min-h-14 cursor-pointer items-center gap-3 border-l border-border px-4 py-3 transition-colors',
        selected
          ? 'bg-accent-muted/35 ring-2 ring-inset ring-accent/25'
          : 'hover:bg-surface/80',
      )}
    >
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={onSelect}
        aria-label={label}
        className="size-4 shrink-0 accent-accent"
      />
      <span className="min-w-0 text-sm leading-snug text-fg">{children}</span>
    </label>
  )
}
