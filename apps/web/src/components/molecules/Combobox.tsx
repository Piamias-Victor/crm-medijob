'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ComboboxOption = { value: string; label: string }

type Props = {
  value?: string
  onChange: (value: string) => void
  options: ComboboxOption[]
  placeholder?: string
  onCreate?: (label: string) => Promise<ComboboxOption>
}

export function Combobox({ value, onChange, options, placeholder = 'Sélectionner', onCreate }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const selected = options.find((o) => o.value === value)
  const q = query.trim().toLowerCase()
  const filtered = options.filter((o) => o.label.toLowerCase().includes(q))
  const showCreate = Boolean(onCreate && q && !options.some((o) => o.label.toLowerCase() === q))

  const pick = (next: string) => {
    onChange(next)
    setOpen(false)
    setQuery('')
  }

  const create = async () => {
    if (!onCreate) return
    const created = await onCreate(query.trim())
    pick(created.value)
  }

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-fg outline-none transition-colors hover:border-accent focus:border-accent focus:ring-2 focus:ring-accent-muted"
      >
        <span className={cn(!selected && 'text-fg-muted')}>{selected?.label ?? placeholder}</span>
        <ChevronDown className={cn('size-4 text-fg-muted transition-transform', open && 'rotate-180')} />
      </button>
      {open ? (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-white shadow-lg">
          <input
            type="search"
            role="searchbox"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
                  onClick={() => pick(o.value)}
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
        </div>
      ) : null}
    </div>
  )
}
