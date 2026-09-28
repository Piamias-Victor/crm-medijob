'use client'

import { Combobox } from '@/components/molecules/Combobox'
import { FilterFieldLabel } from '@/components/organisms/filter-bar/filter-field-label'
import { FILTER_ALL_OPTION } from '@/lib/filters/filter-options'
import type { SelectFilterConfig } from '@/lib/filters/filter-types'

type Props = {
  config: SelectFilterConfig
  value: string
  onChange: (value: string) => void
}

export function FilterSelectField({ config, value, onChange }: Props) {
  const options =
    config.options.some((option) => option.value === '')
      ? [...config.options]
      : [FILTER_ALL_OPTION, ...config.options]
  return (
    <FilterFieldLabel label={config.label} className="w-36">
      <Combobox
        value={value}
        onChange={onChange}
        placeholder={config.placeholder ?? 'Tous'}
        options={options}
      />
    </FilterFieldLabel>
  )
}
