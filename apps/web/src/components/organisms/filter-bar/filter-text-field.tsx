import { Input } from '@/components/atoms/Input'
import { FilterFieldLabel } from '@/components/organisms/filter-bar/filter-field-label'
import type { TextFilterConfig } from '@/lib/filters/filter-types'

type Props = {
  config: TextFilterConfig
  value: string
  onChange: (value: string) => void
}

export function FilterTextField({ config, value, onChange }: Props) {
  return (
    <FilterFieldLabel label={config.label} className="w-32">
      <Input
        type="search"
        value={value}
        placeholder={config.placeholder ?? config.label}
        className="h-[38px] py-1.5"
        onChange={(event) => onChange(event.target.value)}
      />
    </FilterFieldLabel>
  )
}
