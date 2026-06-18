'use client'

import { pillNavLinkClass } from '@/view-models/pill-nav-link'
import { cn } from '@/lib/cn'
import { CONTEXT_OPTIONS } from '@/lib/assistant/context'
import type { ShortcutEntityType } from '@/server/ai/shortcuts'

type Props = {
  value?: ShortcutEntityType
  onChange: (value?: ShortcutEntityType) => void
}

export function ContextTypePills({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Type de contexte">
      <button
        type="button"
        onClick={() => onChange(undefined)}
        aria-pressed={!value}
        className={cn(pillNavLinkClass(!value), 'px-3 py-1.5 text-xs')}
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
            className={cn(pillNavLinkClass(active), 'px-3 py-1.5 text-xs')}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
