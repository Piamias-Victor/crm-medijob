import { Input } from '@/components/atoms/Input'
import type { DateRangeValue } from '@/lib/filters/filter-types'
import type { DateRangeFilterConfig } from '@/lib/filters/filter-types'

type Props = {
  config: DateRangeFilterConfig
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
}

export function FilterDateRangeField({ config, value, onChange }: Props) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-fg-muted">{config.label}</span>
      <div className="flex gap-2">
        <Input
          type="date"
          value={value.from}
          aria-label={`${config.label} — début`}
          className="h-[38px] py-1.5"
          onChange={(event) => onChange({ ...value, from: event.target.value })}
        />
        <Input
          type="date"
          value={value.to}
          aria-label={`${config.label} — fin`}
          className="h-[38px] py-1.5"
          onChange={(event) => onChange({ ...value, to: event.target.value })}
        />
      </div>
    </div>
  )
}
