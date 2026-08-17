'use client'

import { CheckboxChip } from '@/components/molecules/CheckboxChip'

export type CheckboxOption = { value: string; label: string }

type Props = {
  options: readonly CheckboxOption[]
  values: string[]
  exclusive?: boolean
  disabled?: boolean
  onChange: (values: string[]) => void
}

export function CheckboxGroup({ options, values, exclusive, disabled, onChange }: Props) {
  const toggle = (value: string, checked: boolean) => {
    if (exclusive) {
      onChange(checked ? [value] : [])
      return
    }
    onChange(checked ? [...values, value] : values.filter((entry) => entry !== value))
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <CheckboxChip
          key={option.value}
          label={option.label}
          checked={values.includes(option.value)}
          disabled={disabled}
          onChange={(checked) => toggle(option.value, checked)}
        />
      ))}
    </div>
  )
}
