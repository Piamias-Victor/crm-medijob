'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import type { ComboboxOption } from '@/components/molecules/ComboboxDropdown.types'
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
  const { anchorRef, panelRef, style } = useAnchoredPanel(open, 280)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (anchorRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, anchorRef, panelRef])

  const toggle = (value: string) => {
    onChange(values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value])
  }

  const summary =
    values.length === 0
      ? placeholder
      : values.length === 1
        ? (options.find((option) => option.value === values[0])?.label ?? values[0])
        : unit
          ? `${values.length} ${unit}`
          : String(values.length)

  const dropdown = open ? (
    <div
      ref={panelRef}
      style={style}
      className="overflow-hidden rounded-md border border-border bg-surface shadow-lg"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <ul className="max-h-56 overflow-y-auto py-1">
        <li>
          <button
            type="button"
            onClick={() => onChange([])}
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-fg hover:bg-surface"
          >
            Tous
            {!values.length ? <Check className="size-4 text-accent" /> : null}
          </button>
        </li>
        {options.map((option) => {
          const checked = values.includes(option.value)
          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => toggle(option.value)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-fg hover:bg-surface"
              >
                {option.label}
                {checked ? <Check className="size-4 text-accent" /> : null}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
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
