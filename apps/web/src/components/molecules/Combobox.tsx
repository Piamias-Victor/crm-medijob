'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useAnchoredPanel } from '@/lib/use-anchored-panel'
import { ComboboxDropdown, type ComboboxOption } from '@/components/molecules/ComboboxDropdown'

export type { ComboboxOption }

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
  const { anchorRef, panelRef, style } = useAnchoredPanel(open)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (anchorRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open, anchorRef, panelRef])

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

  const selected = options.find((o) => o.value === value)
  const lower = query.toLowerCase()
  const filtered = options.filter((o) => o.label.toLowerCase().includes(lower))
  const showCreate = Boolean(
    onCreate &&
      query.trim() &&
      !options.some((o) => o.label.toLowerCase() === query.trim().toLowerCase()),
  )

  const panel = open ? (
    <ComboboxDropdown
      panelRef={panelRef}
      style={style}
      value={value}
      query={query}
      onQueryChange={setQuery}
      filtered={filtered}
      showCreate={showCreate}
      onPick={pick}
      onCreate={create}
    />
  ) : null

  return (
    <div ref={anchorRef} className="relative">
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
      {typeof document !== 'undefined' && panel ? createPortal(panel, document.body) : null}
    </div>
  )
}
