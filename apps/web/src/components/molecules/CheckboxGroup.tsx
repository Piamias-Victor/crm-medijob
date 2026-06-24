'use client'

import { cn } from '@/lib/cn'

export type CheckboxOption = { value: string; label: string }

type Props = {
  options: readonly CheckboxOption[]
  values: string[]
  onChange: (values: string[]) => void
}

export function CheckboxGroup({ options, values, onChange }: Props) {
  const toggle = (value: string) => {
    onChange(values.includes(value) ? values.filter((v) => v !== value) : [...values, value])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const checked = values.includes(option.value)
        return (
          <label
            key={option.value}
            className={cn(
              'cursor-pointer rounded-md border px-3 py-1.5 text-sm transition-colors',
              checked
                ? 'border-accent bg-accent-muted text-accent-hover'
                : 'border-border bg-white text-fg hover:border-accent/50',
            )}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={() => toggle(option.value)}
            />
            {option.label}
          </label>
        )
      })}
    </div>
  )
}
