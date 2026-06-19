'use client'

import { type RefObject } from 'react'
import { Check, Plus } from 'lucide-react'

export type ComboboxOption = { value: string; label: string }

type Props = {
  panelRef: RefObject<HTMLDivElement | null>
  style: React.CSSProperties
  value?: string
  query: string
  onQueryChange: (query: string) => void
  filtered: ComboboxOption[]
  showCreate: boolean
  onPick: (value: string) => void
  onCreate: () => void
}

export function ComboboxDropdown({
  panelRef,
  style,
  value,
  query,
  onQueryChange,
  filtered,
  showCreate,
  onPick,
  onCreate,
}: Props) {
  return (
    <div
      ref={panelRef}
      style={style}
      className="overflow-hidden rounded-md border border-border bg-white shadow-lg"
    >
      <input
        type="search"
        role="searchbox"
        autoFocus
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Rechercher…"
        className="w-full border-b border-border px-3 py-2 text-sm outline-none placeholder:text-fg-muted"
      />
      <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
        {filtered.map((o) => (
          <li key={o.value}>
            <button
              type="button"
              role="option"
              aria-selected={o.value === value}
              onClick={() => onPick(o.value)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-fg hover:bg-surface"
            >
              {o.label}
              {o.value === value ? <Check className="size-4 text-accent" /> : null}
            </button>
          </li>
        ))}
      </ul>
      {showCreate ? (
        <button
          type="button"
          onClick={onCreate}
          className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-left text-sm font-medium text-accent hover:bg-surface"
        >
          <Plus className="size-4" /> Créer « {query.trim()} »
        </button>
      ) : null}
    </div>
  )
}
