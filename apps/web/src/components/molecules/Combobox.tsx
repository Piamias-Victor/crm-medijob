'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { ComboboxDropdown, type ComboboxOption } from '@/components/molecules/ComboboxDropdown'
import { FloatingPanel } from '@/components/molecules/FloatingPanel'
import { useFloatingPanel } from '@/lib/hooks/use-floating-panel'

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
  const root = useRef<HTMLDivElement>(null)
  const panelStyle = useFloatingPanel(open, root)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (root.current?.contains(target)) return
      if (target instanceof Element && target.closest('[data-floating-panel]')) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const pick = (next: string) => {
    onChange(next)
    setOpen(false)
    setQuery('')
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
      <FloatingPanel
        style={panelStyle}
        className="overflow-hidden rounded-md border border-border bg-white shadow-lg"
      >
        <ComboboxDropdown
          value={value}
          query={query}
          onQuery={setQuery}
          options={options}
          onPick={pick}
          onCreate={onCreate}
        />
      </FloatingPanel>
    </div>
  )
}
