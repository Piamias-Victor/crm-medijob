'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ComboboxMultiPanel } from '@/components/molecules/ComboboxMultiPanel'
import type { ComboboxOption } from '@/components/molecules/ComboboxDropdown.types'
import { useOutsidePointerClose } from '@/lib/hooks/use-outside-pointer-close'
import { useAnchoredPanel } from '@/lib/use-anchored-panel'
import { cn } from '@/lib/cn'

type Props = {
  values: string[]
  onChange: (values: string[]) => void
  options: readonly ComboboxOption[]
  placeholder?: string
  unit?: string
}

export function ComboboxMulti({ values, onChange, options, placeholder = 'Tous', unit }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { anchorRef, panelRef, style } = useAnchoredPanel(open, 280)
  useOutsidePointerClose(open, () => setOpen(false), anchorRef, panelRef)

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const summary = !values.length
    ? placeholder
    : values.length === 1
      ? (options.find((option) => option.value === values[0])?.label ?? values[0])
      : unit
        ? `${values.length} ${unit}`
        : String(values.length)

  const dropdown = open ? (
    <ComboboxMultiPanel
      panelRef={panelRef}
      style={style}
      values={values}
      onChange={onChange}
      options={options}
      query={query}
      onQueryChange={setQuery}
    />
  ) : null

  return (
    <div ref={anchorRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-[38px] w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none transition-colors hover:border-accent focus:border-accent focus:ring-2 focus:ring-accent-muted"
      >
        <span className={cn(!values.length && 'text-fg-muted')}>{summary}</span>
        <ChevronDown className={cn('size-4 text-fg-muted transition-transform', open && 'rotate-180')} />
      </button>
      {typeof document !== 'undefined' && dropdown ? createPortal(dropdown, document.body) : null}
    </div>
  )
}
