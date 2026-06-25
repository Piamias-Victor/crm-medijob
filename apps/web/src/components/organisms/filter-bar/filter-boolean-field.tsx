'use client'

import { Combobox } from '@/components/molecules/Combobox'
import { FilterFieldLabel } from '@/components/organisms/filter-bar/filter-field-label'
import { FILTER_ALL_OPTION } from '@/lib/filters/filter-options'
import type { BooleanFilterConfig } from '@/lib/filters/filter-types'

const BOOLEAN_OPTIONS = [
  { value: 'true', label: 'Oui' },
  { value: 'false', label: 'Non' },
] as const

type Props = {
  config: BooleanFilterConfig
  value: boolean | null
  onChange: (value: boolean | null) => void
}

export function FilterBooleanField({ config, value, onChange }: Props) {
  const selected = value === null ? '' : value ? 'true' : 'false'

  return (
    <FilterFieldLabel label={config.label} className="w-36">
      <Combobox
        value={selected}
        placeholder="Tous"
        options={[FILTER_ALL_OPTION, ...BOOLEAN_OPTIONS]}
        onChange={(next) => onChange(next === '' ? null : next === 'true')}
      />
    </FilterFieldLabel>
  )
}
