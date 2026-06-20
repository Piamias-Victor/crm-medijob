'use client'

import { Search, X, SearchX } from 'lucide-react'
import { useEntitySearch } from '@/lib/assistant/use-entity-search'
import { contextPlaceholder, type ContextValue } from '@/lib/assistant/context'
import { Input } from '@/components/atoms/Input'
import { EmptyState } from '@/components/atoms/EmptyState'
import type { ShortcutEntityType } from '@/server/ai/shortcuts'

type Props = {
  entityType: ShortcutEntityType
  value: ContextValue
  onChange: (value: ContextValue) => void
}

export function EntitySearch({ entityType, value, onChange }: Props) {
  const { term, setTerm, results, isLoading, hasQuery } = useEntitySearch(entityType)

  if (value.entityId && value.entityLabel) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-accent/25 bg-accent-muted/50 px-3 py-2">
        <span className="truncate text-sm font-medium text-fg">{value.entityLabel}</span>
        <button
          type="button"
          aria-label="Retirer la fiche"
          onClick={() => onChange({ entityType })}
          className="grid size-6 place-items-center rounded-full text-fg-muted transition-colors hover:bg-white/80"
        >
          <X className="size-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={contextPlaceholder(entityType)}
          aria-label={contextPlaceholder(entityType)}
          className="h-10 rounded-lg bg-white/80 pl-9"
        />
      </div>
      {hasQuery ? (
        <ul className="max-h-48 divide-y divide-border/60 overflow-y-auto rounded-lg border border-border/60 bg-white/95 shadow-sm">
          {isLoading ? <li className="px-3 py-2 text-xs text-fg-muted">Recherche…</li> : null}
          {!isLoading && results.length === 0 ? (
            <li className="px-3 py-2">
              <EmptyState icon={SearchX} title="Aucun résultat" variant="compact" />
            </li>
          ) : null}
          {results.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onClick={() =>
                  onChange({ entityType, entityId: option.id, entityLabel: option.label })
                }
                className="flex w-full flex-col items-start px-3 py-2 text-left transition-colors hover:bg-accent-muted/40"
              >
                <span className="text-sm font-medium text-fg">{option.label}</span>
                {option.sublabel ? (
                  <span className="text-xs text-fg-muted">{option.sublabel}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
