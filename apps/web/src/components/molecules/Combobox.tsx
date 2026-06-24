'use client'

import { createPortal } from 'react-dom'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useComboboxPanel } from '@/lib/hooks/use-combobox-panel'
import { ComboboxDropdown } from '@/components/molecules/ComboboxDropdown'
import type { ComboboxOption } from '@/components/molecules/ComboboxDropdown.types'
import { filterComboboxOptions, shouldShowComboboxCreate } from '@/view-models/combobox-filter'

export type { ComboboxOption }

type Props = {
  value?: string
  onChange: (value: string) => void
  options: readonly ComboboxOption[]
  placeholder?: string
  onCreate?: (label: string) => Promise<ComboboxOption>
}

export function Combobox({ value, onChange, options, placeholder = 'Sélectionner', onCreate }: Props) {
  const [open, setOpen] = useState(false)
  const panel = useComboboxPanel(open, setOpen, onChange, onCreate)
  const selected = options.find((option) => option.value === value)
  const filtered = filterComboboxOptions(options, panel.query)
  const showCreate = shouldShowComboboxCreate(options, panel.query, Boolean(onCreate))

  const dropdown = open ? (
    <ComboboxDropdown
      panelRef={panel.panelRef}
      style={panel.style}
      value={value}
      query={panel.query}
      onQueryChange={panel.setQuery}
      filtered={filtered}
      showCreate={showCreate}
      onPick={panel.pick}
      onCreate={panel.create}
      createError={panel.createError}
    />
  ) : null

  return (
    <div ref={panel.anchorRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none transition-colors hover:border-accent focus:border-accent focus:ring-2 focus:ring-accent-muted"
      >
        <span className={cn(!selected && 'text-fg-muted')}>{selected?.label ?? placeholder}</span>
        <ChevronDown className={cn('size-4 text-fg-muted transition-transform', open && 'rotate-180')} />
      </button>
      {typeof document !== 'undefined' && dropdown ? createPortal(dropdown, document.body) : null}
    </div>
  )
}
