'use client'

import { type RefObject } from 'react'
import { Check, Plus } from 'lucide-react'
import { Input } from '@/components/atoms/Input'
import type { ComboboxOption } from '@/components/molecules/ComboboxDropdown.types'

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
  createError?: string | null
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
  createError,
}: Props) {
  return (
    <div
      ref={panelRef}
      style={style}
      className="overflow-hidden rounded-md border border-border bg-surface shadow-lg"
    >
      <Input
        type="search"
        role="searchbox"
        autoFocus
        variant="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Rechercher…"
        className="rounded-none border-x-0 border-t-0"
      />
      <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
        {filtered.map((o) => (
          <li key={o.value}>
            <button
              type="button"
              role="option"
              aria-selected={o.value === value}
              onClick={() => onPick(o.value)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-fg transition-colors hover:bg-accent-muted hover:text-accent-hover"
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
          className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-left text-sm font-medium text-accent transition-colors hover:bg-accent-muted hover:text-accent-hover"
        >
          <Plus className="size-4" /> Créer « {query.trim()} »
        </button>
      ) : null}
      {createError ? (
        <p role="alert" className="border-t border-error/25 bg-error/5 px-3 py-2 text-sm text-error">
          {createError}
        </p>
      ) : null}
    </div>
  )
}
