import { Input } from '@/components/atoms/Input'
import type { NumberRangeValue } from '@/lib/filters/filter-types'
import type { NumberRangeFilterConfig } from '@/lib/filters/filter-types'

type Props = {
  config: NumberRangeFilterConfig
  value: NumberRangeValue
  onChange: (value: NumberRangeValue) => void
}

export function FilterNumberRangeField({ config, value, onChange }: Props) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-fg-muted">{config.label}</span>
      <div className="flex gap-2">
        <Input
          type="number"
          inputMode="decimal"
          value={value.min}
          placeholder="Min"
          aria-label={`${config.label} — minimum`}
          className="h-[38px] py-1.5"
          onChange={(event) => onChange({ ...value, min: event.target.value })}
        />
        <Input
          type="number"
          inputMode="decimal"
          value={value.max}
          placeholder="Max"
          aria-label={`${config.label} — maximum`}
          className="h-[38px] py-1.5"
          onChange={(event) => onChange({ ...value, max: event.target.value })}
        />
      </div>
    </div>
  )
}
