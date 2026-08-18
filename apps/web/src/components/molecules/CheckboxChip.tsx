'use client'

import { cn } from '@/lib/cn'

type Props = {
  label: string
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}

export function CheckboxChip({ label, checked, disabled, onChange }: Props) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'rounded-md border px-3 py-1.5 text-left text-sm transition-colors',
        disabled && 'pointer-events-none opacity-50',
        checked
          ? 'border-accent bg-accent-muted text-accent-hover'
          : 'border-border bg-white text-fg hover:border-accent/50',
      )}
    >
      {label}
    </button>
  )
}
