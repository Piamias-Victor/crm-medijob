'use client'

import { Search, X } from 'lucide-react'
import { useEntitySearch } from '@/lib/assistant/use-entity-search'
import { contextPlaceholder, type ContextValue } from '@/lib/assistant/context'
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
      <div className="flex items-center justify-between gap-2 rounded-lg border border-primary/40 bg-primary-muted px-3 py-2">
        <span className="truncate text-sm font-medium text-fg">{value.entityLabel}</span>
        <button
          type="button"
          aria-label="Retirer la fiche"
          onClick={() => onChange({ entityType })}
          className="grid size-5 place-items-center rounded-full text-fg-muted hover:bg-white"
        >
          <X className="size-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={contextPlaceholder(entityType)}
          aria-label={contextPlaceholder(entityType)}
          className="w-full rounded-lg border border-border bg-white py-2 pl-8 pr-3 text-sm text-fg outline-none placeholder:text-fg-muted focus:border-accent focus:ring-2 focus:ring-accent-muted"
        />
      </div>
      {hasQuery ? (
        <ul className="max-h-56 divide-y divide-border overflow-y-auto rounded-lg border border-border bg-white">
          {isLoading ? <li className="px-3 py-2 text-xs text-fg-muted">Recherche…</li> : null}
          {!isLoading && results.length === 0 ? (
            <li className="px-3 py-2 text-xs text-fg-muted">Aucun résultat</li>
          ) : null}
          {results.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onClick={() =>
                  onChange({ entityType, entityId: option.id, entityLabel: option.label })
                }
                className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-surface"
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
