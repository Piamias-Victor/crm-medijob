'use client'

import type { CSSProperties, RefObject } from 'react'
import { Check } from 'lucide-react'
import { Input } from '@/components/atoms/Input'
import { COMBOBOX_OPTION_CLASS } from '@/lib/combobox-option-class'
import type { ComboboxOption } from '@/components/molecules/ComboboxDropdown.types'
import { filterComboboxOptions } from '@/view-models/combobox-filter'

type Props = {
  panelRef: RefObject<HTMLDivElement | null>
  style: CSSProperties
  values: string[]
  onChange: (values: string[]) => void
  options: readonly ComboboxOption[]
  query: string
  onQueryChange: (query: string) => void
}

export function ComboboxMultiPanel({
  panelRef,
  style,
  values,
  onChange,
  options,
  query,
  onQueryChange,
}: Props) {
  const filtered = filterComboboxOptions(options, query)
  const toggle = (value: string) => {
    onChange(values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value])
  }

  return (
    <div
      ref={panelRef}
      style={style}
      className="overflow-hidden rounded-md border border-border bg-surface shadow-lg"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <Input
        type="search"
        role="searchbox"
        autoFocus
        variant="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Rechercher…"
        className="rounded-none border-x-0 border-t-0"
      />
      <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
        <li>
          <button type="button" onClick={() => onChange([])} className={COMBOBOX_OPTION_CLASS}>
            Tous
            {!values.length ? <Check className="size-4 text-accent" /> : null}
          </button>
        </li>
        {filtered.map((option) => {
          const checked = values.includes(option.value)
          return (
            <li key={option.value}>
              <button type="button" onClick={() => toggle(option.value)} className={COMBOBOX_OPTION_CLASS}>
                {option.label}
                {checked ? <Check className="size-4 text-accent" /> : null}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
