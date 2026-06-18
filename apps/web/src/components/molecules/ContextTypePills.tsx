'use client'

import { cn } from '@/lib/cn'
import { CONTEXT_OPTIONS } from '@/lib/assistant/context'
import type { ShortcutEntityType } from '@/server/ai/shortcuts'

type Props = {
  value?: ShortcutEntityType
  onChange: (value?: ShortcutEntityType) => void
}

const pill = 'rounded-full px-3 py-1.5 text-xs font-medium transition-colors'

export function ContextTypePills({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Type de contexte">
      <button
        type="button"
        onClick={() => onChange(undefined)}
        aria-pressed={!value}
        className={cn(pill, !value ? 'bg-fg text-primary-fg' : 'text-fg-muted hover:bg-surface')}
      >
        Aucun
      </button>
      {CONTEXT_OPTIONS.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={cn(
              pill,
              active
                ? 'bg-primary text-primary-fg shadow-sm'
                : 'border border-border text-fg hover:bg-surface',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
