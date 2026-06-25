'use client'

import { createPortal } from 'react-dom'
import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { useAnchoredPanel } from '@/lib/use-anchored-panel'
import { COMBOBOX_OPTION_CLASS } from '@/lib/combobox-option-class'
import { useOutsidePointerClose } from '@/lib/hooks/use-outside-pointer-close'
import { cn } from '@/lib/cn'

type Props = {
  value: number
  options: readonly number[]
  onChange: (value: number) => void
}

export function TablePageSizeSelect({ value, options, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const { anchorRef, panelRef, style } = useAnchoredPanel(open, 120)
  useOutsidePointerClose(open, () => setOpen(false), anchorRef, panelRef)

  const dropdown = open ? (
    <div
      ref={panelRef}
      style={style}
      className="overflow-hidden rounded-md border border-border bg-surface shadow-lg"
    >
      <ul role="listbox" className="py-1">
        {options.map((option) => (
          <li key={option}>
            <button
              type="button"
              role="option"
              aria-selected={option === value}
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
              className={COMBOBOX_OPTION_CLASS}
            >
              {option}
              {option === value ? <Check className="size-4 text-accent" /> : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  ) : null

  return (
    <div ref={anchorRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Nombre de lignes par page"
        onClick={() => setOpen((current) => !current)}
        className="flex h-8 min-w-14 items-center justify-between gap-1 rounded-md border border-border bg-surface px-2 text-sm text-fg transition-colors hover:border-accent focus:border-accent focus:ring-2 focus:ring-accent-muted"
      >
        {value}
        <ChevronDown className={cn('size-4 text-fg-muted transition-transform', open && 'rotate-180')} />
      </button>
      {typeof document !== 'undefined' && dropdown ? createPortal(dropdown, document.body) : null}
    </div>
  )
}
