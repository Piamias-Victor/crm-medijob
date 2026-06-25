'use client'

import { ComboboxMulti } from '@/components/molecules/ComboboxMulti'
import { FilterFieldLabel } from '@/components/organisms/filter-bar/filter-field-label'
import type { MultiSelectFilterConfig } from '@/lib/filters/filter-types'

type Props = {
  config: MultiSelectFilterConfig
  values: string[]
  onChange: (values: string[]) => void
}

export function FilterMultiSelectField({ config, values, onChange }: Props) {
  return (
    <FilterFieldLabel label={config.label} className="w-36">
      <ComboboxMulti
        values={values}
        onChange={onChange}
        options={config.options}
        placeholder="Tous"
        unit={config.unit}
      />
    </FilterFieldLabel>
  )
}
