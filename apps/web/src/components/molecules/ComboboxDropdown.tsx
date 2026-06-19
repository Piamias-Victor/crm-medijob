'use client'

import { Check, Plus } from 'lucide-react'

export type ComboboxOption = { value: string; label: string }

type Props = {
  value?: string
  query: string
  onQuery: (value: string) => void
  options: ComboboxOption[]
  onPick: (value: string) => void
  onCreate?: (label: string) => Promise<ComboboxOption>
}

export function ComboboxDropdown({ value, query, onQuery, options, onPick, onCreate }: Props) {
  const q = query.trim().toLowerCase()
  const filtered = options.filter((o) => o.label.toLowerCase().includes(q))
  const showCreate = Boolean(onCreate && q && !options.some((o) => o.label.toLowerCase() === q))

  const create = async () => {
    if (!onCreate) return
    const created = await onCreate(query.trim())
    onPick(created.value)
  }

  return (
    <>
      <input
        type="search"
        role="searchbox"
        autoFocus
        value={query}
        onChange={(e) => onQuery(e.target.value)}
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
          onClick={create}
          className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-left text-sm font-medium text-accent hover:bg-surface"
        >
          <Plus className="size-4" /> Créer « {query.trim()} »
        </button>
      ) : null}
    </>
  )
}
